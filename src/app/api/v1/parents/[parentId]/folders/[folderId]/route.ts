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
    // const images = await prisma.image.findMany({
    //   where: {
    //     folderId,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     url: true,
    //     uploadedBy: true,
    //     createdAt: true,
    //   },
    //   orderBy: {
    //     createdAt: "desc", // newest first
    //   },
    // });

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId
      },
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true,
        images: {
          select: {
            id: true,
            name: true,
            url: true,
            createdAt: true,
            uploadedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        subfolders: {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            images: {
              select: {
                id: true,
                url: true
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        }
      }
    })

    const subfoldersWithCounts = await Promise.all(
      folder.subfolders.map(async (sf) => {
        const count = await prisma.image.count({
          where: { folderId: sf.id },
        });

        return {
          ...sf,
          imageCount: count,
        };
      })
    );

    const folderWithCount = {
      ...folder,
      subfolders: subfoldersWithCounts,
    };

    return Res.ok({
      message: "Images fetched successfully",
      data: folderWithCount,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Res.serverError({ message });
  }
}