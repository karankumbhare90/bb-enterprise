import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET() {
  try {
    await connectDB();
    // Exclude password field
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already registered" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
      isVerified: false,
      verificationToken,
    });

    // Determine the base URL for the verification link
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verificationLink = `${origin}/api/verify?token=${verificationToken}`;

    // Call Google Apps Script Webhook
    const scriptUrl = process.env.GOOGLE_API_SCRIPT || process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "VERIFICATION",
            email: email,
            link: verificationLink
          }),
        });
      } catch (fetchError) {
        console.error("Failed to trigger Google Script:", fetchError);
      }
    } else {
      console.warn("Google Script URL not set in environment variables. Verification email was not sent.");
    }

    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    delete userToReturn.verificationToken;

    return NextResponse.json(
      { success: true, data: userToReturn },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST User Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
