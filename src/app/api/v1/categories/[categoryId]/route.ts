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
        status: true,
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
    });
    return Res.success({
      message: "Category fetch successfully",
      data: categories,
    });
  } catch (error) {
    return Res.serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return Res.badRequest({ message: "Category ID is required" });
    }

    // Check if product exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (existingCategory) {
      const categoryProducts = await prisma.product.findMany({
        where: { categoryId: categoryId },
      });
      const subCategories = await prisma.subCategory.findMany({
        where: { parentId: categoryId }
      })

      if (subCategories.length > 0) {
        await prisma.subCategory.deleteMany({
          where: { parentId: categoryId }
        })
      }

      if (categoryProducts.length > 0) {
        await prisma.product.deleteMany({
          where: { categoryId: categoryId },
        });
      }

      // Delete the category
      await prisma.category.delete({
        where: { id: categoryId },
      });

      return Res.success({
        message: "Category deleted successfully",
        data: categoryId
      });
    }

    const existingMusicCategory = await prisma.musicCategory.findUnique({
      where: { id: categoryId },
    });

    if (existingMusicCategory) {
      const categoryMusic = await prisma.music.findMany({
        where: { categoryId: categoryId },
      });

      const subCategories = await prisma.muiscSubCategory.findMany({
        where: { parentId: categoryId }
      })

      if (subCategories.length > 0) {
        await prisma.muiscSubCategory.deleteMany({
          where: { parentId: categoryId }
        })
      }

      if (categoryMusic.length > 0) {
        await prisma.music.deleteMany({
          where: { categoryId: categoryId },
        });
      }

      // Delete the category
      await prisma.musicCategory.delete({
        where: { id: categoryId },
      });

      return Res.success({
        message: "Category deleted successfully",
        data: categoryId
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
  { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return Res.badRequest({ message: "Category ID is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (existingCategory) {
      const { name, slug, status } = await req.json();

      if (!name || !slug || !status) {
        return Res.badRequest({ message: "Name, Status and Slug are required" });
      }

      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name, slug, status },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          _count: {
            select: { products: true }
          },
          createdAt: true,
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
        }
      });

      return Res.success({
        message: "Category updated successfully",
        data: updatedCategory
      });
    }

    const existingMusicCategory = await prisma.musicCategory.findUnique({
      where: { id: categoryId },
    });

    if (existingMusicCategory) {
      const { name, slug, status } = await req.json();
      if (!name || !slug || !status) {
        return Res.badRequest({ message: "Name, Status and Slug are required" });
      }
      const updatedCategory = await prisma.musicCategory.update({
        where: { id: categoryId },
        data: { name, slug, status },
        select: { id: true, name: true, slug: true, status: true, _count: { select: { musics: true } }, createdAt: true }
      });
      return Res.success({
        message: "Category updated successfully",
        data: updatedCategory
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