import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, message: "File exceeds 5MB size limit." }, { status: 400 });
    }

    // Validate type (must be image)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "File must be an image." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique name
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const fileExtension = file.name.split(".").pop() || "webp";
    const filename = `${timestamp}-${random}.${fileExtension}`;
    const filePath = join(uploadDir, filename);

    // Save file
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Failed to upload file." }, { status: 500 });
  }
}
