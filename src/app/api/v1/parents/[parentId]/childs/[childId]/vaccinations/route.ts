import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, childId } = await params;
    if (!parentId || !childId) {
      return Res.badRequest({ message: "Parent & Child ID is required" });
    }
    const vaccinations = await prisma.vaccination.findMany({
      where: {
        childId,
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
      },
    });
    return Res.success({
      message: "Vaccinations",
      data: vaccinations,
    });
  } catch (error) {
    return Res.serverError();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { title, dueDate } = await req.json();
  const { childId, parentId } = await params;
  try {
    if (!title || !dueDate) {
      return Res.badRequest({ message: "All fields are required" });
    }
    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
      select: { id: true },
    });
    if (!existingChild) {
      return Res.unauthorized({ message: "No child found" });
    }
    await prisma.vaccination.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        childId,
      },
    });
    return Res.created({ message: "Vaccination record has been saved" });
  } catch (error) {
    return Res.serverError();
  }
}
