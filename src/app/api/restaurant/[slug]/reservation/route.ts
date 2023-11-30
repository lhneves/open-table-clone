import { findAvailableTables } from '@/services/restaurant/findAvailableTables';
import { NextRequest, NextResponse } from 'next/server';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import prisma from '../../../../../../prisma/db';

const schema = zfd.formData({
  bookerEmail: zfd.text(z.string().email()),
  bookerPhone: zfd.text(),
  bookerFirstName: zfd.text(),
  bookerLastName: zfd.text(),
  bookerOccasion: zfd.text(z.string().optional()),
  bookerRequest: zfd.text(z.string().optional()),
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const searchParams = req.nextUrl.searchParams;
  const day = searchParams.get('day');
  const time = searchParams.get('time');
  const partySize = searchParams.get('partySize');

  if (!day || !time || !partySize) {
    return NextResponse.json({ errorMessage: 'Invalid data provided' }, { status: 400 });
  }

  const {
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  } = schema.parse(await req.json());

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
      id: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json({ errorMessage: 'Restaurant not found' }, { status: 400 });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return NextResponse.json(
      { errorMessage: 'Restaurant is not open at that time' },
      { status: 400 },
    );
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    restaurant,
  });

  if (!searchTimesWithTables || !Array.isArray(searchTimesWithTables)) {
    return NextResponse.json({ errorMessage: 'Invalid data provided' }, { status: 400 });
  }

  const searchTimeWithTables = searchTimesWithTables.find((t) => {
    return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
  });

  if (!searchTimeWithTables) {
    return NextResponse.json({ errorMessage: 'No availablity, cannot book' }, { status: 400 });
  }

  const tablesCount: { 2: number[]; 4: number[] } = {
    2: [],
    4: [],
  };

  searchTimeWithTables.tables.forEach((table) => {
    if (table.seats === 2) {
      tablesCount[2].push(table.id);
    } else {
      tablesCount[4].push(table.id);
    }
  });

  const tablesToBook: number[] = [];

  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4].length) {
        tablesToBook.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      } else {
        tablesToBook.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      }
    } else {
      if (tablesCount[2].length) {
        tablesToBook.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      } else {
        tablesToBook.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      restaurant_id: restaurant.id,
    },
  });

  const bookingsOnTablesData = tablesToBook.map((table_id) => {
    return {
      table_id,
      booking_id: booking.id,
    };
  });

  await prisma.bookingsOnTables.createMany({
    data: bookingsOnTablesData,
  });

  return NextResponse.json(booking);
}
