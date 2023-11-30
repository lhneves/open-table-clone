import React from 'react';
import RestaurantNavbar from '../components/RestaurantNavbar';
import Title from '../components/Title';
import Rating from '../components/Rating';
import prisma from '../../../../prisma/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Description from '../components/Description';
import Images from '../components/Images';
import Reviews from '../components/Reviews';
import ReservationCard from '../components/ReservationCard';

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
    title: `${renderTitle()} | OpenTable`,
    description: `Reserve a table in ${renderTitle()}`,
  };
}

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function RestaurantDetails({ params }: { params: { slug: string } }) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={params.slug} />
        <Title name="Milesstone Grill" />
        <Rating reviews={restaurant.reviews} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={params.slug}
        />
      </div>
    </>
  );
}
