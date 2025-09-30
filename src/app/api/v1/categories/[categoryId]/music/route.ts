import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";
import { ApiResponse } from "@/lib/types";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { categoryId } = await params;
        const body = await req.json();
        const { title, url, mimeType, size, uploadedBy, type, price, thumbnail } = body;

        // Validation
        if (!title || !url || !mimeType || !size) {
            return Res.badRequest({
                message: "title, url, mimeType, and size are required",
            });
        }

        // Music create
        const music = await prisma.music.create({
            data: {
                title,
                url,
                mimeType,
                size,
                type,
                price,
                thumbnail,
                uploadedBy: {
                    connect: {
                        id: uploadedBy,
                    },
                },
                category: {
                    connect: { id: categoryId },
                },
            },
        });

        return Res.created({
            message: "Music created successfully",
            data: music,
        });
    } catch (error) {
        console.error("Music create error:", error);
        return Res.serverError();
    }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { categoryId } = await params;
        const musics = await prisma.music.findMany({
            where: { categoryId },
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
                },
                categoryId: true
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