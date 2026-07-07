import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    let setting = await Setting.findOne();

    // Create default settings if none exist
    if (!setting) {
      setting = await Setting.create({});
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const description = formData.get("description") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactMobile = formData.get("contactMobile") as string;
    const contactAddress = formData.get("contactAddress") as string;
    const googleMapLink = formData.get("googleMapLink") as string;

    let socialIcons = [];
    try {
      const socialIconsStr = formData.get("socialIcons") as string;
      if (socialIconsStr) {
        socialIcons = JSON.parse(socialIconsStr);
      }
    } catch (e) {
      console.warn("Failed to parse socialIcons");
    }

    let awards = [];
    try {
      const awardsStr = formData.get("awards") as string;
      if (awardsStr) {
        awards = JSON.parse(awardsStr);
      }
    } catch (e) {
      console.warn("Failed to parse awards");
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }

    let siteLogo = setting.siteLogo;
    let cloudinaryId = setting.cloudinaryId;

    const imageEntry = formData.get("siteLogo");
    if (imageEntry instanceof File && imageEntry.size > 0) {
      if (cloudinaryId) {
        await deleteImageFromCloudinary(cloudinaryId);
      }
      const buffer = Buffer.from(await imageEntry.arrayBuffer());
      const uploadResult = await uploadImageToCloudinary(buffer, "bb-enterprise/settings");
      siteLogo = uploadResult.url;
      cloudinaryId = uploadResult.public_id;
    }

    setting.title = title ?? setting.title;
    setting.metaTitle = metaTitle ?? setting.metaTitle;
    setting.metaDescription = metaDescription ?? setting.metaDescription;
    setting.description = description ?? setting.description;
    setting.contactEmail = contactEmail ?? setting.contactEmail;
    setting.contactMobile = contactMobile ?? setting.contactMobile;
    setting.contactAddress = contactAddress ?? setting.contactAddress;
    setting.googleMapLink = googleMapLink ?? setting.googleMapLink;
    setting.socialIcons = socialIcons;
    setting.awards = awards;
    setting.siteLogo = siteLogo;
    setting.cloudinaryId = cloudinaryId;

    await setting.save();

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    console.error("PUT Settings Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
