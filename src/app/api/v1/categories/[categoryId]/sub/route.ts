import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
        return Res.badRequest({ message: "Category ID is required." })
    }
    const body = await req.json();
    const { name, slug, adminId, status } = body;

    if (!name || !slug || !adminId || !status) {
      return Res.badRequest({ message: "Name, slug, status and adminId are required" });
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        slug,
        adminId,
        status: status || "ACTIVE",
        parentId: categoryId
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return Res.success({
      message: "Sub Category created successfully",
      data: subCategory,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return Res.error({
        message: "Slug already exists",
        status: 409,
      });
    }
    console.error(error)
    return Res.serverError({ message: "Internal Server Error" });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId } = await params;
    if (!categoryId) {
      return Res.badRequest({ message: "Category id is invalid" });
    }
    const subCategories = await prisma.subCategory.findMany({
      where: { parentId: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    });
    return Res.success({
      message: "Sub Categories fetch successfully",
      data: subCategories,
    });
  } catch (error) {
    return Res.serverError();
  }
}