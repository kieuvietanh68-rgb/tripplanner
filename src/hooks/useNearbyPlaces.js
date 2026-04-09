import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_GOONG_API_KEY;

export default function useNearbyPlaces(location, locationName) {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!location) return;

    const fetchNearby = async () => {
      try {
        const res = await fetch(
          `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=di tích lịch sử ${locationName}&location=${location.lat},${location.lng}&radius=5000`
        );

        const data = await res.json();

        const keywords = [
          "lăng",
          "đền",
          "chùa",
          "văn miếu",
          "di tích",
          "bảo tàng",
          "thành",
        ];

        const filtered = (data.predictions || []).filter((p) => {
          const text = p.description.toLowerCase();

          const isCorrectPlace = locationName
            ? text.includes(locationName.toLowerCase())
            : true;

          const isHistorical = keywords.some((k) =>
            text.includes(k)
          );

          return isCorrectPlace && isHistorical;
        });

        setPlaces(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNearby();
  }, [location, locationName]);

  return places;
}