import { useEffect, useState } from "react";

export default function useNearbyHotels(location) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    if (!location) return;

    const fetchHotels = async () => {
      try {
        const res = await fetch(
          `https://rsapi.goong.io/Place/AutoComplete?input=hotel&location=${location.lat},${location.lng}&type=lodging&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
        );

        const data = await res.json();

        setHotels(data.predictions || []);
      } catch (err) {
        console.error("Hotel fetch error:", err);
      }
    };

    fetchHotels();
  }, [location]);

  return hotels;
}