import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; childId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, childId } = await params;
    const { name, dateOfBirth, dateOfDeath, relation } = await req.json();
    if (!parentId || !childId) {
      return Res.badRequest({ message: "Parent & Child ID is required" });
    }
    if (!name || !dateOfBirth) {
      return Res.badRequest({ message: "All fields are required" });
    }
    const existingParent = await prisma.parent.findUnique({
      where: { id: parentId },
    });
    if (!existingParent) {
      return Res.badRequest({ message: "No Parent found" });
    }
    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
    });
    if (!existingChild) {
      return Res.badRequest({ message: "No child found" });
    }
    const result = await prisma.childRelation.create({
      data: {
        name,
        dateOfBirth,
        dateOfDeath,
        relation,
        childId: existingChild.id,
      },
    });
    return Res.created({ message: "Relation added successfully" });
  } catch (error) {
    console.log(error);
    return Res.serverError();
  }
}
