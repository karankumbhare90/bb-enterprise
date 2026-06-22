import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, mobileNo, category, message } = data;

    if (!firstName || !email || !mobileNo || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Save to Database
    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      mobileNo,
      category,
      message,
    });

    // 2. Trigger Google Apps Script Webhook
    const scriptUrl = process.env.GOOGLE_API_SCRIPT || process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "CONTACT",
            firstName,
            lastName,
            email,
            mobileNo,
            category,
            message,
          }),
        });

        if (!response.ok) {
          console.error("Google script responded with an error status:", response.status);
          // We don't fail the submission if the email fails, we just log it.
        }
      } catch (fetchError) {
        console.error("Failed to trigger Google Script:", fetchError);
      }
    } else {
      console.warn("Google Script URL not set in environment variables. Contact email was not sent.");
    }

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      contact: newContact,
    });
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while submitting the contact form" },
      { status: 500 }
    );
  }
}
