
import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const { title, creatorId, participantIds } = body;

    if (!title || !creatorId) {
      return Res.badRequest({ message: "Title and creatorId are required" });
    }

    // Create chat with participants
    const chat = await prisma.chat.create({
      data: {
        title,
        creatorId,
        chatParticipants: {
          create: participantIds.map((pid: string) => ({
            parentId: pid,
          })),
        },
      },
      include: {
        chatParticipants: true,
      },
    });

    return Res.created({
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error(error);
    return Res.serverError();
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }
    const messages = await prisma.message.findMany({
      where: {
        parentId,
      },
      omit: {
        parentId: true,
      },
    });
    return Res.ok({ message: "Messages fetch successfully", data: messages });
  } catch (error) {
    return Res.serverError();
  }
}
