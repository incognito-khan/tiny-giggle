import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return Res.badRequest({ message: "Category id is invalid" });
    }
    const categories = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    return Res.success({
      message: "Category fetch successfully",
      data: categories,
    });
  } catch (error) {
    return Res.serverError();
  }
}
