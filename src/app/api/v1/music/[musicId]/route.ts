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
        const musics = await prisma.music.findMany({
            where: { id: musicId },
            orderBy: { createdAt: "desc" },
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
                }
            }
        });

        return Res.success({
            message: "All music fetched successfully",
            data: musics,
        });
    } catch (error) {
        console.error("Music fetch error:", error);
        return Res.serverError();
    }
}