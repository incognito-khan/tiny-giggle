import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { uploadFileToS3 } from "@/lib/helpers/s3";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ parentId: string; folderId: string }> }
) {
    try {
        const { parentId, folderId } = await params;

        const formData = await req.formData();
        const file = formData.get("file") as File

        if (!file) {
            return Res.badRequest({ message: "File is required" })
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileUrl = await uploadFileToS3(buffer, file.type);

        const image = await prisma.image.create({
            data: {
                name: file.name,
                url: fileUrl,
                folderId,
                uploadedBy: parentId,
            },
            select: {
                id: true,
                name: true,
                url: true,
                folderId: true,
                uploadedBy: true,
                createdAt: true,
            },
        });

        return Res.ok({
            message: "Image uploaded and saved successfully",
            data: image,
        });

    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return Res.serverError({ message });
    }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; folderId: string }> }
) {
  try {
    const { parentId, folderId } = await params;

    // ✅ Get all images of a specific folder
    const images = await prisma.image.findMany({
      where: {
        folderId,
      },
      select: {
        id: true,
        name: true,
        url: true,
        uploadedBy: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return Res.ok({
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Res.serverError({ message });
  }
}