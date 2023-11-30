import React from 'react';
import { Metadata } from 'next';

import Header from '../components/Header';
import Form from '../components/Form';
import { notFound } from 'next/navigation';
import prisma from '../../../../prisma/db';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const renderTitle = () => {
    const nameArray = params.slug.split('-');

    nameArray[nameArray.length - 1] = `(${nameArray[nameArray.length - 1]})`;

    return nameArray.join(' ');
  };

  return {
    title: `Reserve at ${renderTitle()}`,
    description: 'Reserve a table on your favorite restaurant',
  };
}

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function Reserve({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  const { date, partySize } = searchParams;

  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          date={date}
          partySize={partySize}
          image={restaurant.main_image}
          name={restaurant.name}
        />
        <Form date={date} partySize={partySize} slug={params.slug} />
      </div>
    </div>
  );
}
