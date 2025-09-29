import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { ApiResponse } from "@/lib/types";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ musicId: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { musicId } = await params;
        const music = await prisma.music.findUnique({
            where: { id: musicId },
            select: {
                id: true,
                title: true,
                mimeType: true,
                url: true,
                size: true,
                type: true,
                price: true,
                thumbnail: true,
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        return Res.success({
            message: "Music fetched successfully",
            data: music,
        });
    } catch (error) {
        console.error("Music fetch error:", error);
        return Res.serverError();
    }
}