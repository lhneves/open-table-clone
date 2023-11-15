import React from 'react';
import { Metadata } from 'next';

import Menu from '../../components/Menu';
import RestaurantNavbar from '../../components/RestaurantNavbar';
import { PrismaClient } from '@prisma/client';
import prisma from '../../../../../prisma/db';

export const metadata: Metadata = {
  title: 'Menu of Milestones Grill (Toronto) | OpenTable',
  description: 'Reserve a table in Milestones Grill (Toronto)',
};

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: { items: true },
  });

  if (!restaurant) {
    throw new Error();
  }

  return restaurant.items;
};

export default async function RestaurantMenu({ params }: { params: { slug: string } }) {
  const menu = await fetchRestaurantMenu(params.slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}
