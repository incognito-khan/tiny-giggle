import { sendEmail } from "@/actions/send-email";
import { Res } from "@/lib/general-response";
import { hashing } from "@/lib/helpers/hash";
import { generateOtp } from "@/lib/helpers/otp-generator";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

async function handleOtpFlow({
  parentId,
  email,
  name,
}: {
  parentId: string;
  email: string;
  name: string;
}) {
  const otp = generateOtp({ length: 6 });
  const hashedOTP = await hashing(otp.code);

  await sendEmail(email, "password-reset-otp", {
    email,
    name,
    otp: otp.code,
    expiresIn: otp.expiresIn,
  });

  await prisma.parentOTP.create({
    data: {
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      type: "PASSWORD_RESET",
      parentId,
    },
  });
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { email } = await req.json();
    if (!email) {
      return Res.badRequest({ message: "Email is required" });
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
      where: { email },
    });
    if (!existingUser) {
      return Res.notFound({ message: "Invalid email" });
    }
    // Remove any old OTP
    await prisma.parentOTP.deleteMany({
      where: { parentId: existingUser.id, type: "PASSWORD_RESET" },
    });

    await handleOtpFlow({
      parentId: existingUser.id,
      email,
      name: existingUser.name,
    });

    return Res.created({ message: "An OTP has been sent to the given email" });
  } catch (error) {
    return Res.serverError();
  }
}
