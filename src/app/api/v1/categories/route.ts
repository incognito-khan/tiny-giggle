import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const { name, slug, adminId } = body;

    if (!name || !slug || !adminId) {
      return Res.badRequest({ message: "Name, slug and adminId are required" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        adminId,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return Res.success({
      message: "Category created successfully",
      data: category,
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
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return Res.success({
      message: "Categories fetch successfully",
      data: categories,
    });
  } catch (error) {
    return Res.serverError();
  }
}
