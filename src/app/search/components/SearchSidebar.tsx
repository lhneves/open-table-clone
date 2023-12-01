import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import React from "react";

interface SearchSidebarProps {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: { location?: string; cuisine?: string; price?: PRICE };
}

export default function SearchSidebar({
  locations,
  cuisines,
  searchParams,
}: SearchSidebarProps) {
  const prices = [
    {
      price: PRICE.CHEAP,
      label: "$",
      className: "rounded-l",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
      className: "",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      className: "rounded-r ",
    },
  ];

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <Link
            key={location.name}
            href={{
              pathname: "/search",
              query: { ...searchParams, location: location.name },
            }}
            className="font-light text-reg capitalize"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            key={cuisine.name}
            href={{
              pathname: "/search",
              query: { ...searchParams, cuisine: cuisine.name },
            }}
            className="font-light text-reg capitalize"
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map(({ price, label, className }) => (
            <Link
              key={label}
              href={{
                pathname: "/search",
                query: { ...searchParams, price },
              }}
              className={`border w-full text-reg text-center font-light p-2 ${className}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
