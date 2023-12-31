import React from 'react';
import { RestaurantCardType } from '../page';
import Link from 'next/link';
import Stars from './Stars';
import Price from './Price';

interface RestaurantCardProps {
  restaurant: RestaurantCardType;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">
              <Stars reviews={restaurant.reviews} />
            </div>
            <p className="ml-2">
              {restaurant.reviews.length} review
              {restaurant.reviews.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <Price price={restaurant.price} />
            <p className=" mr-3">{restaurant.cuisine.name}</p>
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}
