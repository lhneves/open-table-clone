import { useState } from "react";
import axios from "axios";

interface IAvailabilitiesProps {
  slug: string;
  partySize: string;
  day: string;
  time: string;
}

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<
    { time: string; available: boolean }[] | null
  >(null);

  const fetchAvalabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: IAvailabilitiesProps) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, data, error, fetchAvalabilities };
}
