import { createMessage } from "@/actions/messages";
import { sendEmail } from "@/actions/send-email";
import { Res } from "@/lib/general-response";
import { compareHashing } from "@/lib/helpers/hash";
import { formatZodErrors } from "@/lib/helpers/zodErrorFormat";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas/login";
import { createAccessToken } from "@/lib/tokens";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { email, password, browser, location, os, time } = await req.json();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = formatZodErrors(result.error.format());
      return Res.badRequest({ message: "Validation failed", errors });
    }
    // if (!captcha) {
    //   return Res.badRequest({ message: "Captcha verification failed" });
    // }

    // const verifyRes = await fetch(
    //   `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    //   { method: "POST" }
    // );

    // const verifyData = await verifyRes.json();

    // if (!verifyData.success) {
    //   return Res.badRequest({ message: "Captcha verification failed" });
    // }

    const existingUser = await prisma.parent.findUnique({
      where: {
        email,
      },
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

    if (existingUser) {
      const isMatch = await compareHashing(password, existingUser.password);
      if (!isMatch) {
        return Res.notFound({ message: "Invalid email or password" });
      }


      if (!existingUser.isVerified) {
        return Res.badRequest({
          message: "Please check your email and verify your account",
        });
      }

      const accessToken = await createAccessToken(existingUser);
      await sendEmail(existingUser.email, "new-login-detected", {
        name: existingUser.name,
        browser,
        location,
        os,
        time,
      });

      return Res.ok({
        message: "Successfully logged in",
        data: {
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.type,
            childs: existingUser.childIds,
            folders: existingUser.folders,
            favoriteMusic: existingUser.favorites
          },
          tokens: {
            accessToken,
          },
        },
      });

    }

    console.log("Code runs till existing user...")

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email
      }
    });

    console.log("Code runs till existing admin found...", existingAdmin)

    if (existingAdmin) {
      const accessToken = await createAccessToken(existingAdmin);
      await sendEmail(existingAdmin.email, "new-login-detected", {
        name: existingAdmin.name,
        browser,
        location,
        os,
        time,
      });

      return Res.ok({
        message: "Successfully logged in",
        data: {
          user: {
            id: existingAdmin.id,
            name: existingAdmin.name,
            email: existingAdmin.email,
            role: "admin"
          },
          tokens: {
            accessToken,
          },
        },
      });

    }


    if (!existingUser && !existingAdmin) {
      return Res.notFound({ message: "Invalid email or password" });
    }

    // const res = await createMessage({
    //   title: "New Login Detected",
    //   parentId: existingUser.id,
    // });


  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Res.serverError({ message });
  }
}
