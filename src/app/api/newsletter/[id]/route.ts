import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Newsletter from "@/models/Newsletter";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deleted = await Newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("DELETE Newsletter Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
