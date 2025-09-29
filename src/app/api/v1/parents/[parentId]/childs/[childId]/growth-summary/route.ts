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
    const growthSummary = await prisma.growthSummary.findMany({
      where: {
        childId,
      },
      select: {
        id: true,
        weight: true,
        height: true,
        date: true,
      },
    });
    return Res.success({
      message: "Growth summary",
      data: growthSummary,
    });
  } catch (error) {
    return Res.serverError();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { parentId, childId } = await params;
  const { weight, height, date } = await req.json();
  if (!parentId || !childId) {
    return Res.badRequest({ message: "Parent & Child ID is required" });
  }
  if (!weight || !height || !date) {
    return Res.badRequest({ message: "Weight, Height & Date are required" });
  }
  try {
    const growthSummary = await prisma.growthSummary.create({
      data: {
        childId,
        weight,
        height,
        date: new Date(date),
      },
      select: {
        id: true,
        weight: true,
        height: true,
        date: true,
      },
    });
    return Res.success({
      message: "Growth summary added successfully",
      data: growthSummary,
    });
  } catch (error) {
    return Res.serverError();
  }
}
