import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";

goongjs.accessToken = process.env.REACT_APP_GOONG_MAP_KEY;

export default function MapView({
  activities,
  selectedPlace,
  setSelectedPlace,
  tripLocation,
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // 🚀 INIT MAP
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = new goongjs.Map({
      container: mapRef.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.85, 21.03],
      zoom: 12,
    });

    mapInstance.current = map;
  }, []);

  // 🎯 ZOOM TO TRIP
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !tripLocation) return;
    if (!tripLocation.lat || !tripLocation.lng) return;

    map.flyTo({
      center: [tripLocation.lng, tripLocation.lat],
      zoom: 12,
    });
  }, [tripLocation]);

  // 🎯 ZOOM TO SELECTED PLACE
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selectedPlace) return;
    if (!selectedPlace.lat || !selectedPlace.lng) return;

    map.flyTo({
      center: [selectedPlace.lng, selectedPlace.lat],
      zoom: 17,
    });
  }, [selectedPlace]);

  // 📍 MARKERS + ROUTE
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const renderMap = () => {
      // ✅ lọc data sạch
      const validActivities =
        activities?.filter(
          (a) =>
            a.location &&
            typeof a.location.lat === "number" &&
            typeof a.location.lng === "number",
        ) || [];

      // ❌ clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (validActivities.length === 0) return;

      // 🔥 sort theo thứ tự
      validActivities.sort((a, b) => (a.order || 0) - (b.order || 0));

      // 📍 MARKERS
      validActivities.forEach((a, index) => {
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width:30px;height:30px;
            background:#1677ff;color:white;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-weight:bold;
            border:2px solid white;
          ">
            ${index + 1}
          </div>
        `;

        el.onclick = () => setSelectedPlace(a);

        const marker = new goongjs.Marker(el)
          .setLngLat([a.location.lng, a.location.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // 🧭 ROUTE LINE
      const coords = validActivities.map((a) => [
        a.location.lng,
        a.location.lat,
      ]);

      // ❌ xoá line cũ
      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }

      // ✅ add source
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coords,
          },
        },
      });

      // ✅ add layer
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff7a45",
          "line-width": 4,
        },
      });

      // 🚀 FIT BOUNDS
      if (coords.length > 1) {
        const bounds = new goongjs.LngLatBounds();

        coords.forEach((c) => {
          if (!c[0] || !c[1]) return;
          bounds.extend(c);
        });

        map.fitBounds(bounds, {
          padding: 80,
          duration: 1000,
        });
      } else {
        const [lng, lat] = coords[0];
        map.flyTo({ center: [lng, lat], zoom: 15 });
      }
    };

    // 🔥 FIX STYLE LOAD
    if (!map.isStyleLoaded()) {
      map.once("load", renderMap);
    } else {
      renderMap();
    }
  }, [activities, setSelectedPlace]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}
