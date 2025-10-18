import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; orderId: string; }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, orderId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }

    if (!orderId) {
      return Res.badRequest({ message: "Order ID is required" });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        shippingAddress: true,
        totalPrice: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        parentId: true,
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

    return Res.ok({ message: "Order fetched successfully", data: order });
  } catch (error) {
    return Res.serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; orderId: string; }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId, orderId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }

    if (!orderId) {
      return Res.badRequest({ message: "Order ID is required" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { parentId: true },
    });

    if (!order) {
      return Res.notFound({ message: "Order not found" });
    }

    if (order.parentId !== parentId) {
      return Res.unauthorized({
        message: "You are not authorized to delete this order",
      });
    }

    await prisma.orderItem.deleteMany({
      where: {
        orderId: orderId,
      },
    });

    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return Res.ok({ message: "Order deleted successfully", data: orderId });
  } catch (error) {
    return Res.serverError();
  }
}