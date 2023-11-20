import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export default async function middleware(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const bearerToken = headersList.get("authorization");

  if (!bearerToken) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request" },
      { status: 401 }
    );
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request" },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/auth/me"],
};
