import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { pusher } from "@/lib/pusher";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const { chatId } = await params;
        const body = await req.json();
        const { senderId, content } = body;

        if (!chatId) {
            return Res.badRequest({ message: "Chat ID is required" });
        }

        if (!senderId) {
            return Res.badRequest({ message: "Sender ID is required" });
        }

        if (!content) {
            return Res.badRequest({ message: "Message content is required" });
        }

        // check if sender is participant in this chat
        const participant = await prisma.chatParticipant.findFirst({
            where: { chatId, parentId: senderId },
        });

        if (!participant) {
            return Res.notFound({
                message: "Sender is not a participant of this chat",
            });
        }

        // create message
        const newMessage = await prisma.chatMessage.create({
            data: {
                message: content,
                chatId,
                chatParticipantId: participant.id,
            },
            include: {
                chatParticipant: {
                    include: {
                        parent: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });

        await pusher.trigger(`chat-${chatId}`, "new-message", {
            id: newMessage.id,
            message: newMessage.message,
            chatId: newMessage.chatId,
            senderId: newMessage.chatParticipant.parent.id,
            senderName: newMessage.chatParticipant.parent.name,
            createdAt: newMessage.createdAt,
        });
        console.log("🔥 Triggering event on channel:", `chat-${chatId}`);

        return Res.created({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error("Message creation error:", error);
        return Res.serverError();
    }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;

    if (!chatId) {
      return Res.badRequest({ message: "Chat ID is required" });
    }

    // messages fetch karo (latest pehle)
    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" }, // "desc" chahiye to ulta kar lena
      include: {
        chatParticipant: {
          include: {
            parent: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return Res.success({
      message: "Messages fetched successfully",
      data: messages.map((msg) => ({
        id: msg.id,
        message: msg.message,
        chatId: msg.chatId,
        senderId: msg.chatParticipant.parent.id,
        senderName: msg.chatParticipant.parent.name,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Message fetch error:", error);
    return Res.serverError();
  }
}