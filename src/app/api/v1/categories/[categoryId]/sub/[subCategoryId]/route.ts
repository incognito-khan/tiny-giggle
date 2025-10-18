import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subCategoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { subCategoryId } = await params;
    if (!subCategoryId) {
      return Res.badRequest({ message: "Sub Category Id is invalid" });
    }
    const subCategories = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true
      },
    });
    return Res.success({
      message: "Sub Category fetch successfully",
      data: subCategories,
    });
  } catch (error) {
    return Res.serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ subCategoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { subCategoryId } = await params;

    if (!subCategoryId) {
      return Res.badRequest({ message: "Sub Category ID is required" });
    }

    // Check if product exists
    const existingCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (existingCategory) {
      const categoryProducts = await prisma.product.findMany({
        where: { subCategoryId },
      });

      if (categoryProducts.length > 0) {
        await prisma.product.deleteMany({
          where: { subCategoryId },
        });
      }

      // Delete the category
      await prisma.subCategory.delete({
        where: { id: subCategoryId },
      });

      return Res.success({
        message: "Sub Category deleted successfully",
        data: subCategoryId
      });
    }

    const existingMusicCategory = await prisma.muiscSubCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (existingMusicCategory) {
      const categoryMusic = await prisma.music.findMany({
        where: { subCategoryId: subCategoryId },
      });

      if (categoryMusic.length > 0) {
        await prisma.music.deleteMany({
          where: { subCategoryId: subCategoryId },
        });
      }

      // Delete the category
      await prisma.muiscSubCategory.delete({
        where: { id: subCategoryId },
      });

      return Res.success({
        message: "Category deleted successfully",
        data: subCategoryId
      });
    }

    if (!existingCategory && !existingMusicCategory) {
      return Res.notFound({ message: "Category not found" });
    }


  } catch (error) {
    console.error(error);
    return Res.serverError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ subCategoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { subCategoryId } = await params;

    if (!subCategoryId) {
      return Res.badRequest({ message: "Sub Category ID is required" });
    }

    const existingCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (existingCategory) {
      const { name, slug, status } = await req.json();

      if (!name || !slug || !status) {
        return Res.badRequest({ message: "Name, Status and Slug are required" });
      }

      const updatedCategory = await prisma.subCategory.update({
        where: { id: subCategoryId },
        data: { name, slug, status },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          parentId: true,
          _count: {
            select: { products: true }
          },
          createdAt: true,
        }
      });

      return Res.success({
        message: "Sub Category updated successfully",
        data: updatedCategory
      });
    }

    const existingMusicCategory = await prisma.muiscSubCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (existingMusicCategory) {
      const { name, slug, status } = await req.json();
      if (!name || !slug || !status) {
        return Res.badRequest({ message: "Name, Status and Slug are required" });
      }
      const updatedCategory = await prisma.muiscSubCategory.update({
        where: { id: subCategoryId },
        data: { name, slug, status },
        select: { id: true, name: true, slug: true, status: true, parentId: true, _count: { select: { music: true } }, createdAt: true }
      });
      return Res.success({
        message: "Category updated successfully",
        data: updatedCategory
      });
    }

    if (!existingCategory) {
      return Res.notFound({ message: "Category not found" });
    }


  } catch (error) {
    console.error(error);
    return Res.serverError();
  }
}