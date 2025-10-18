import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const { name, slug, adminId, status } = body;

    if (!name || !slug || !adminId || !status) {
      return Res.badRequest({ message: "Name, slug, status and adminId are required" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        adminId,
        status: status || "ACTIVE"
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
        status: true,
        _count: {
          select: { products: true },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            createdAt: true,
            _count: {
              select: { products: true },
            },
          }
        }
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
    console.error(error.message)
    return Res.serverError({ message: "Internal Server Error" });
  }
}
