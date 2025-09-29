import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { verifyAccessTokenFromRequest } from "@/lib/tokens";
import { NextRequest } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ parentId: string }> }
) {
    try {
        const { success, message } = await verifyAccessTokenFromRequest(req);
        if (!success) {
            return Res.unauthorized({ message });
        }

        const { parentId } = await params;
        if (!parentId) {
            return Res.badRequest({ message: "Parent ID is required" });
        }

        const body = await req.json();
        const { musicId } = body;

        if (!musicId) {
            return Res.badRequest({
                message: "Music ID is required",
            });
        }

        const existingParent = await prisma.parent.findUnique({
            where: { id: parentId },
        });

        if (!existingParent) {
            return Res.notFound({ message: "Invalid creatorId provided" });
        }

        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                parentId_musicId: {
                    parentId,
                    musicId,
                },
            },
        });

        let favorite: any;

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    parentId_musicId: {
                        parentId,
                        musicId,
                    },
                },
            });
            return Res.success({
                message: "Removed from favorites",
                data: null,
            });
        } else {
            favorite = await prisma.favorite.create({
                data: {
                    parentId,
                    musicId,
                },
            });
            return Res.created({
                message: "Added to favorites",
                data: favorite,
            });
        }

    } catch (error) {
        console.error("Chat creation error:", error);
        return Res.serverError();
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ parentId: string }> }
) {
    try {
        const { parentId } = await params;

        if (!parentId) {
            return Res.badRequest({ message: "parentId is required" });
        }

        const favorites = await prisma.favorite.findMany({
            where: { parentId },
            include: {
                music: {
                    select: {
                        id: true,
                        title: true,
                        url: true,
                        thumbnail: true,
                        uploadedBy: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return Res.success({
            message: "Favorites fetched successfully",
            data: favorites,
        });
    } catch (error) {
        console.error("Favorites GET error:", error);
        return Res.serverError();
    }
}
