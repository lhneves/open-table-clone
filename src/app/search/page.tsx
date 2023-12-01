import React from 'react';
import { Metadata } from 'next';

import Header from './components/Header';
import SearchSidebar from './components/SearchSidebar';
import RestaurantCard from './components/RestaurantCard';
import { PRICE } from '@prisma/client';
import prisma from '../../../prisma/db';

export const metadata: Metadata = {
  title: 'Search | Open Table',
  description: 'Search you favorite restaurant',
};

interface ISearchParam {
  location?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantsByParams = async (searchParam: ISearchParam) => {
  const { location, cuisine, price } = searchParam;

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    reviews: true,
  };

  if (!location && !cuisine && !price) return prisma.restaurant.findMany({ select });

  return prisma.restaurant.findMany({
    where: {
      location: { name: { contains: location?.toLocaleLowerCase() } },
      cuisine: { name: { contains: cuisine?.toLocaleLowerCase() } },
      price: { equals: price },
    },
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};

const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function Search({ searchParams }: { searchParams: ISearchParam }) {
  const restaurants = await fetchRestaurantsByParams(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar locations={locations} cuisines={cuisines} searchParams={searchParams} />
        <div className="w-5/6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry, we found no restaurants in this area</p>
          )}
        </div>
      </div>
    </>
  );
}
