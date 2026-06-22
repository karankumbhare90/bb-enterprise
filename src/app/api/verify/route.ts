import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Invalid or missing token" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid verification token or token expired." }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear token after successful verification
    await user.save();

    // Determine origin to redirect to login page
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Redirect to the admin login page with a success query param
    return NextResponse.redirect(`${origin}/admin/login?verified=true`);
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during verification." },
      { status: 500 }
    );
  }
}
