import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { ApiResponse } from "@/lib/types";

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const categories = await prisma.musicCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: { musics: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return Res.success({
      message: "Music Categories fetch successfully",
      data: categories,
    });
  } catch (error) {
    return Res.serverError();
  }
}