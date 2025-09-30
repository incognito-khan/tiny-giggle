"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";

export async function createMessage({
  title,
  parentId,
  description,
}: {
  title: string;
  parentId?: string;
  description?: string;
}): Promise<ApiResponse> {
  try {
    if (!title) {
      return { success: false, message: "Title is required " };
    }
    if (parentId) {
      await prisma.message.create({
        data: {
          title,
          description,
          parentId,
        },
      });
    } else {
      await prisma.message.create({
        data: {
          title,
          description,
        },
      });
    }
    return { success: true, message: "Message created succesfully" };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
}
