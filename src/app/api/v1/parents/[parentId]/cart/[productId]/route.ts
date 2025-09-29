import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Res } from "@/lib/general-response";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ parentId: string; productId: string }> }
) {
    try {
        const { parentId, productId } = await params;
        const body = await req.json();
        const { quantity } = body;

        if (!parentId) {
            return Res.badRequest({ message: "Parent ID is required" });
        }

        if (!productId) {
            return Res.badRequest({ message: "Product ID is required" });
        }

        if (!quantity) {
            return Res.badRequest({ message: "Quantity is required" });
        }

        const existingParent = await prisma.parent.findUnique({
            where: { id: parentId },
        });

        if (!existingParent) {
            return Res.notFound({ message: "Parent not found" });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            return Res.notFound({ message: "Product not found" });
        }

        let cart = await prisma.cart.findFirst({
            where: { parentId: parentId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { parentId: parentId }
            });
        }

        let cartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId }
        });

        const totalPrice = existingProduct.salePrice * quantity;

        if (cartItem) {
            // Update quantity
            cartItem = await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity + quantity,
                    price: existingProduct.salePrice * (cartItem.quantity + quantity)
                },
            });

            return Res.ok({
                message: "Cart item updated successfully",
                data: {
                    id: cartItem.id,
                    cartId: cartItem.cartId,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                }
            });
        } else {
            // Add new product
            cartItem = await prisma.cartItem.create({
                data: { cartId: cart.id, productId, quantity, price: totalPrice },
            });

            return Res.created({
                message: "Product added to cart successfully",
                data: {
                    id: cartItem.id,
                    cartId: cartItem.cartId,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                }
            });
        }
    } catch (error) {
        console.error("Cart item creation error:", error);
        return Res.serverError();
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { productId: string; parentId: string } }) {
    try {
        const { productId, parentId } = params;
        const body = await req.json();
        const { reduceBy } = body;

        if (!parentId) return Res.badRequest({ message: "User ID is required" });
        if (!productId) return Res.badRequest({ message: "Product ID is required" });
        if (!reduceBy || reduceBy <= 0) return Res.badRequest({ message: "Reduce amount must be positive" });

        // Find cart
        const cart = await prisma.cart.findFirst({ where: { parentId } });
        if (!cart) return Res.notFound({ message: "Cart not found" });

        // Find cart item
        const cartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });
        if (!cartItem) return Res.notFound({ message: "Product not in cart" });

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return Res.notFound({ message: "Product not found" });

        // Reduce quantity or delete
        const newQuantity = cartItem.quantity - reduceBy;
        if (newQuantity > 0) {
            const updatedCartItem = await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: newQuantity,
                    price: product.salePrice * newQuantity,
                },
            });
            return Res.ok({
                message: "Cart item quantity reduced", data: {
                    id: updatedCartItem.id,
                    cartId: updatedCartItem.cartId,
                    productId: updatedCartItem.productId,
                    quantity: updatedCartItem.quantity,
                    price: updatedCartItem.price,
                }
            });
        } else {
            await prisma.cartItem.delete({ where: { id: cartItem.id } });
            return Res.ok({ message: "Cart item removed" });
        }

    } catch (error) {
        console.error("Cart PATCH error:", error);
        return Res.serverError();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { parentId: string; productId: string } }) {
    try {
        const { parentId, productId } = params;

        if (!parentId) return Res.badRequest({ message: "Parent ID is required" });
        if (!productId) return Res.badRequest({ message: "Product ID is required" });

        const cart = await prisma.cart.findFirst({ where: { parentId } });
        if (!cart) return Res.notFound({ message: "Cart not found" });

        const cartItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });
        if (!cartItem) return Res.notFound({ message: "Product not in cart" });

        await prisma.cartItem.delete({ where: { id: cartItem.id } });
        return Res.ok({ message: "Cart item removed successfully" });

    } catch (error) {
        console.error("Cart DELETE error:", error);
        return Res.serverError();
    }
}