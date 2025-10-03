import { NextRequest, NextResponse } from "next/server";
const { OAuth2Client } = require("google-auth-library");
import { prisma } from "@/lib/prisma";
import { createAccessToken } from "@/lib/tokens";

// Google OAuth2 client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json()

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        // Google se verify karo
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
        }

        const email = payload.email;

        // Check if Parent exists
        const existingParent = await prisma.parent.findUnique({
            where: { email },
            include: {
                children: {
                    select: {
                        id: true,
                    },
                },
                folders: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        ownerId: true,
                        subfolders: {
                            select: {
                                id: true
                            }
                        },
                        createdAt: true
                    }
                },
                favorites: {
                    select: {
                        id: true,
                        musicId: true
                    }
                }
            },
        });

        if (!existingParent) {
            return NextResponse.json({ error: "No account found" }, { status: 404 });
        }

        const accessToken = await createAccessToken(existingParent);

        // Agar account hai to success return karo
        return NextResponse.json({
            message: "Login successful",
            data: {
                user: {
                    id: existingParent.id,
                    name: existingParent.name,
                    email: existingParent.email,
                    role: existingParent.type,
                    childs: existingParent.childIds,
                    folders: existingParent.folders,
                    favoriteMusic: existingParent.favorites
                },
                tokens: { accessToken }
            }
        });
    } catch (error) {
        console.error("Google login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
