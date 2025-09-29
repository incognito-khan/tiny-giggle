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
        const { title, time } = body;

        // ✅ Validation
        if (!title || !time) {
            return Res.badRequest({
                message: "title, time are required",
            });
        }

        // ✅ Activity create
        const activity = await prisma.activity.create({
            data: {
                title,
                time: time,
                parentId: parentId,
                childId,
            }
        });

        return Res.created({
            message: "Activity created successfully",
            data: activity,
        });
    } catch (error) {
        console.error("Activity create error:", error);
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

        // ✅ Get all activities of this child
        const activities = await prisma.activity.findMany({
            where: {
                childId,
                parentId,
                time: { gte: new Date() },
            },
            orderBy: { time: "asc" },
            select: {
                id: true,
                title: true,
                time: true
            }
        });

        return Res.success({
            message: "Activities fetched successfully",
            data: activities,
        });
    } catch (error) {
        console.error(error);
        return Res.serverError();
    }
}