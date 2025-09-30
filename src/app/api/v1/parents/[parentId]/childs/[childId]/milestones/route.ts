import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { ApiResponse } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, childId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }
    if (!childId) {
      return Res.badRequest({ message: "Child ID is required" });
    }
    const body = await req.json();
    const { title, description, date, imageUrl } = body;

    // ✅ Validation
    if (!title || !date) {
      return Res.badRequest({
        message: "title, date are required",
      });
    }

    // ✅ Milestone create
    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        date: new Date(date),
        parentId: parentId,
        childId,
        imageUrl,
      }
    });

    return Res.created({
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    console.error("Milestone create error:", error);
    return Res.serverError();
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, childId } = await params;

    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }
    if (!childId) {
      return Res.badRequest({ message: "Child ID is required" });
    }

    // ✅ Get all milestones of this child
    const milestones = await prisma.milestone.findMany({
      where: { childId, parentId },
      orderBy: { date: "asc" },
    });

    return Res.success({
      message: "Milestones fetched successfully",
      data: milestones,
    });
  } catch (error) {
    console.error(error);
    return Res.serverError();
  }
}