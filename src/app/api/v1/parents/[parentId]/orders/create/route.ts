import { ApiResponse } from "@/lib/types";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
type Data = {
  shippingAddress: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  orderItems: {
    productId: string;
    quantity: number;
  }[];
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string; }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const { parentId } = await params;
    if (!parentId) {
      return Res.badRequest({ message: "Parent ID is required" });
    }
    const {
      shippingAddress,
      totalPrice,
      orderStatus,
      paymentStatus,
      orderItems,
    }: Data = await req.json();
    if (
      !shippingAddress ||
      !totalPrice ||
      !orderStatus ||
      !paymentStatus ||
      !orderItems
    ) {
      return Res.badRequest({ message: "All fields are required" });
    }
    const order = await prisma.order.create({
      data: {
        parentId,
        shippingAddress,
        totalPrice,
        orderStatus,
        paymentStatus,
      },
    });
    // Create all order items
    await Promise.all(
      orderItems.map((item) =>
        prisma.orderItem.create({
          data: {
            quantity: item.quantity,
            productId: item.productId,
            orderId: order.id,
          },
        })
      )
    );
    return Res.created({ message: "Order has been created" });
  } catch (error) {
    return Res.serverError();
  }
}
