import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string; productId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId, productId } = await params;
    if (!categoryId || !productId) {
      return Res.badRequest({ message: "Category or product id is invalid" });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        quantity: true,
        costPrice: true,
        salePrice: true,
        taxPercent: true,
      },
    });
    return Res.success({
      message: "Single product fetch successfully",
      data: product,
    });
  } catch (error) {
    return Res.serverError();
  }
}
