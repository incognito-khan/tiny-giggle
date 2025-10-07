import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }

    const orders = await prisma.order.findMany({
      where: {
        parentId: parentId,
      },
      select: {
        id: true,
        shippingAddress: true,
        totalPrice: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        orderItems: {
            select: {
                id: true,
                quantity: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        costPrice: true,
                        quantity: true,
                        image: true,
                    }
                }
            }
        }
      }
    });

    return Res.ok({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    return Res.serverError();
  }
}