import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css"; // 🔥 BẮT BUỘC

goongjs.accessToken = process.env.REACT_APP_GOONG_MAP_KEY;

export default function MapView({ activities, selectedPlace, tripLocation }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  useEffect(() => {
    if (!tripLocation || !mapInstance.current) return;

    mapInstance.current.flyTo({
      center: [tripLocation.lng, tripLocation.lat],
      zoom: 12,
    });
  }, [tripLocation]);
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new goongjs.Map({
        container: mapRef.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [105.85, 21.03],
        zoom: 12,
      });
    }

    // 🔥 clear marker cũ
    if (mapInstance.current._markers) {
      mapInstance.current._markers.forEach((m) => m.remove());
    }
    mapInstance.current._markers = [];

    // 🔥 add marker
    activities?.forEach((a) => {
      if (a.location) {
        const marker = new goongjs.Marker()
          .setLngLat([a.location.lng, a.location.lat])
          .addTo(mapInstance.current);

        mapInstance.current._markers.push(marker);
      }
    });
  }, [activities]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100vh",
        borderRadius: "20px",
      }}
    />
  );
}
