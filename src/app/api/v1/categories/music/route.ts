import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { ApiResponse } from "@/lib/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const { name, slug, adminId } = body;

    if (!name || !slug || !adminId) {
      return Res.badRequest({ message: "Name, slug and adminId are required" });
    }

    const category = await prisma.musicCategory.create({
      data: {
        name,
        slug,
        adminId,
      },
      include: {
        _count: {
          select: { musics: true },
        },
      },
    });

    return Res.success({
      message: "Music Category created successfully",
      data: category
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return Res.error({
        message: "Slug already exists",
        status: 409,
      });
    }
    return Res.serverError();
  }
}

export async function GET(
  _req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const musics = await prisma.music.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        mimeType: true,
        url: true,
        size: true,
        type: true,
        price: true,
        thumbnail: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categoryId: true
      }
    });

    return Res.success({
      message: "All music fetched successfully",
      data: musics,
    });
  } catch (error) {
    console.error("Music fetch error:", error);
    return Res.serverError();
  }
}