import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

goongjs.accessToken = process.env.REACT_APP_GOONG_MAP_KEY;

export default function MapView({
  activities,
  selectedPlace,
  setSelectedPlace,
  tripLocation,
  hotels,
  tripId,
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

    map.flyTo({
      center: [tripLocation.lng, tripLocation.lat],
      zoom: 12,
    });
  }, [tripLocation]);

  // 🎯 ZOOM TO SELECTED PLACE
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selectedPlace) return;

    map.flyTo({
      center: [selectedPlace.lng, selectedPlace.lat],
      zoom: 17,
    });
  }, [selectedPlace]);

  // 📍 MARKERS + ROUTE
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const renderMap = async () => {
      // clear marker
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // filter activity
      const validActivities =
        activities?.filter(
          (a) =>
            a.location &&
            typeof a.location.lat === "number" &&
            typeof a.location.lng === "number"
        ) || [];

      validActivities.sort((a, b) => (a.order || 0) - (b.order || 0));

      // 🔴 ACTIVITY
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

      // 🏨 HOTEL
      const hotelPromises =
        hotels?.slice(0, 5).map(async (h) => {
          try {
            const res = await fetch(
              `https://rsapi.goong.io/Place/Detail?place_id=${h.place_id}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
            );

            const data = await res.json();
            const loc = data.result.geometry.location;

            const el = document.createElement("div");

            el.innerHTML = `
              <div style="
                width:26px;
                height:26px;
                background:#ff4d4f;
                border-radius:50%;
                border:3px solid white;
                box-shadow:0 4px 12px rgba(0,0,0,0.3);
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:14px;
                color:white;
              ">
                🏨
              </div>
            `;

            el.style.cursor = "pointer";

            // 🔥 CLICK → ADD BOOKING
            el.onclick = async () => {
              try {
                await addDoc(collection(db, "bookings"), {
                  tripId,
                  type: "hotel",
                  hotelName: data.result.name,
                  address: data.result.formatted_address,
                  location: loc,
                  createdAt: Date.now(),
                });

                console.log("HOTEL ADDED");
              } catch (err) {
                console.error(err);
              }
            };

            // hover effect
            el.onmouseenter = () => {
              el.style.transform = "scale(1.2)";
            };
            el.onmouseleave = () => {
              el.style.transform = "scale(1)";
            };

            const marker = new goongjs.Marker({ element: el })
              .setLngLat([loc.lng, loc.lat])
              .setPopup(
                new goongjs.Popup().setHTML(
                  `<strong>🏨 ${data.result.name}</strong><br/>Click để thêm`
                )
              )
              .addTo(map);

            markersRef.current.push(marker);
          } catch (err) {
            console.log("hotel marker error", err);
          }
        }) || [];

      await Promise.all(hotelPromises);
      // 🧭 ROUTE
      const coords = validActivities.map((a) => [
        a.location.lng,
        a.location.lat,
      ]);

      if (map.getSource("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }

      if (coords.length > 0) {
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

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ff7a45",
            "line-width": 4,
          },
        });
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", renderMap);
    } else {
      renderMap();
    }
  }, [activities, hotels, setSelectedPlace, tripId]);

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