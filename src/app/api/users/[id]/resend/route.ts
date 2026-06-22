import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, error: "User is already verified" }, { status: 400 });
    }

    let token = user.verificationToken;

    if (!token) {
      // If for some reason the token is missing (e.g., old data), generate a new one
      token = crypto.randomBytes(32).toString("hex");
      user.verificationToken = token;
      await user.save();
    }

    // Determine the base URL for the verification link
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verificationLink = `${origin}/api/verify?token=${token}`;

    // Call Google Apps Script Webhook
    const scriptUrl = process.env.GOOGLE_API_SCRIPT || process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "VERIFICATION",
            email: user.email,
            link: verificationLink
          }),
        });

        if (!response.ok) {
          console.error("Google script responded with an error status:", response.status);
          return NextResponse.json({ success: false, error: "Failed to trigger Google Script." }, { status: 500 });
        }
      } catch (fetchError) {
        console.error("Failed to trigger Google Script:", fetchError);
        return NextResponse.json({ success: false, error: "Failed to trigger Google Script." }, { status: 500 });
      }
    } else {
      console.warn("Google Script URL not set in environment variables. Verification email was not sent.");
      return NextResponse.json({ success: false, error: "Email script URL is not configured." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.error("Resend Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while resending the email" },
      { status: 500 }
    );
  }
}
