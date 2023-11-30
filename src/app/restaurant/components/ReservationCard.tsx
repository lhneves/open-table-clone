'use client';

import React, { useMemo, useState } from 'react';

import { partySize as partySizes, times } from '@/data';
import DatePicker from 'react-datepicker';
import useAvailabilities from '@/hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { convertToDisplayTime } from '@/utils/convertToDisplayTime';

interface ReservationCardProps {
  openTime: string;
  closeTime: string;
  slug: string;
}

export default function ReservationCard({ openTime, closeTime, slug }: ReservationCardProps) {
  const { data, loading, fetchAvalabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState('2');
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);

  const findTimeIndex = (t: string) => times.findIndex((time) => time.time === t);

  const filteredRestaurantOpenWindowTimes = useMemo(() => {
    return times.slice(findTimeIndex(openTime), findTimeIndex(closeTime) + 1);
  }, [openTime, closeTime]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split('T')[0]);
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  };

  const handleClick = () => {
    fetchAvalabilities({ slug, day, partySize, time });
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          <option value=""></option>
          {partySizes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-24"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filteredRestaurantOpenWindowTimes.map((time) => (
              <option key={time.time} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : 'Find a Time'}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) => {
              return time.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-white text-center mb-3 rounded mr-3"
                >
                  <p className="text-small font-bold">{convertToDisplayTime(time.time)}</p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 text-white mb-3 rounded mr-3"></p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
