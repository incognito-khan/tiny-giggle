import { sendEmail } from "@/actions/send-email";
import { Res } from "@/lib/general-response";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Res.badRequest({ message: "All fields are required" });
    }
    const existingUser = await prisma.parent.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return Res.unauthorized({ message: "No account found" });
    }
    const verifiedOtp = await prisma.parentOTP.findFirst({
      where: {
        type: "PASSWORD_RESET",
        parent: {
          email,
        },
      },
    });
    if (!verifiedOtp) {
      return Res.unauthorized({
        message: "You are not allowed to change password",
      });
    }
    await prisma.parentOTP.delete({ where: { id: verifiedOtp.id } });
    // Email already updated in another flow
    await sendEmail(existingUser.email, "password-changed-success", {
      name: existingUser.name,
    });
    return Res.ok({ message: "Your password has been reset" });
  } catch (error) {
    return Res.serverError();
  }
}
