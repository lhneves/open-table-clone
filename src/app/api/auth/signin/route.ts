import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse<any>) {
  const { email, password } = await req.json();
  const errors: string[] = [];

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, {
        min: 1,
      }),
      errorMessage: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length > 0) {
    return NextResponse.json(
      { errorMessage: errors[0], error: errors[0] },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        errorMessage: "Email or password is invalid",
        error: "Email or password is invalid",
      },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({
      errorMessage: "Email or password is invalid",
      error: "Email or password is invalid",
    });
  }

  const alg = "HS256";

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({ email: user.email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  cookies().set("jwt", token, { maxAge: 60 * 6 * 24 });

  return NextResponse.json(
    {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    },
    { status: 200 }
  );
}
