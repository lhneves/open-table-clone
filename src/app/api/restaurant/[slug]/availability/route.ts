import { findAvailableTables } from '@/services/restaurant/findAvailableTables';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const searchParams = req.nextUrl.searchParams;

  const day = searchParams.get('day');
  const time = searchParams.get('time');
  const partySize = searchParams.get('partySize');

  if (!day || !time || !partySize) {
    return NextResponse.json({ errorMessage: 'Invalid data provided' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json({ errorMessage: 'Invalid data provided' }, { status: 400 });
  }

  const searchTimesWithTables = await findAvailableTables({
    time,
    day,
    restaurant,
  });

  if (!searchTimesWithTables || !Array.isArray(searchTimesWithTables)) {
    return NextResponse.json({ errorMessage: 'Invalid data provided' }, { status: 400 });
  }

  const availabilities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return { time: t.time, available: sumSeats >= parseInt(partySize) };
    })
    .filter((availability) => {
      const timeIsAfterOpeningHours =
        new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`);

      const timeIsBeforeClosingHours =
        new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`);

      return timeIsAfterOpeningHours && timeIsBeforeClosingHours;
    });

  return NextResponse.json(availabilities);
}
