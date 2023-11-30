import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import prisma from '../../../../../prisma/db';

export async function GET() {
  const headersList = headers();
  const bearerToken = headersList.get('authorization') as string;

  const token = bearerToken.split(' ')[1];

  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return NextResponse.json(
      {
        errorMessage: 'Unauthorized request',
      },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      city: true,
      phone: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        errorMessage: 'User not found',
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    city: user.city,
  });
}
