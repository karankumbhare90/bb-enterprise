import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.status === "Unsubscribed") {
        existing.status = "Subscribed";
        await existing.save();
      } else {
        return NextResponse.json(
          { success: true, message: "Already subscribed" }
        );
      }
    } else {
      // Save to Database
      await Newsletter.create({ email });
    }

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
            type: "NEWSLETTER",
            email,
          }),
        });

        if (!response.ok) {
          console.error("Failed to trigger webhook:", await response.text());
        }
      } catch (webhookError) {
        console.error("Webhook Error:", webhookError);
        // Don't fail the request if webhook fails, we still saved to DB
      }
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Newsletter Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
