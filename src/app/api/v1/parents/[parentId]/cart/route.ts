import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";

export async function GET(req: NextRequest, { params }: { params: { parentId: string } }) {
    try {
        const { parentId } = params;

        if (!parentId) return Res.badRequest({ message: "Parent ID is required" });

        // Find parent's cart
        const cart = await prisma.cart.findFirst({ where: { parentId } });
        if (!cart) return Res.notFound({ message: "Cart not found" });

        // Get all cart items with product details
        const cartItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            select: {
                id: true,
                quantity: true,
                price: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                        costPrice: true,
                        salePrice: true,
                        quantity: true,
                        category: { select: { id: true, name: true } },
                    }
                },
            },
        });

        return Res.ok({ message: "Cart items fetched successfully", data: cartItems });

    } catch (error) {
        console.error("Cart GET error:", error);
        return Res.serverError();
    }
}
