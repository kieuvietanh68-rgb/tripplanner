import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Planner from "../components/Planner";
import Note from "../components/Note";
import Budget from "../components/Budget";
import MapView from "../components/MapView";
import useNearbyPlaces from "../hooks/useNearbyPlaces";
import NearbySuggestions from "../components/NearbySuggestions";
import BookingTab from "../components/BookingTab";
import useNearbyHotels from "../hooks/useNearbyHotels";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import { Box, Typography } from "@mui/material";

export default function TripDetail() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [tripLocation, setTripLocation] = useState(null);

  const [activities, setActivities] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activityText, setActivityText] = useState("");
  const [selectedPlaceByDay, setSelectedPlaceByDay] = useState({});

  // 👉 map vẫn giữ cho planner (không liên quan booking)
  const [selectedPlace, setSelectedPlace] = useState(null);

  const nearbyHotels = useNearbyHotels(tripLocation);
  const nearbyPlaces = useNearbyPlaces(tripLocation, trip?.destination);

  // =============================
  // 📌 LOAD TRIP
  // =============================
  useEffect(() => {
    const fetchTrip = async () => {
      const docRef = doc(db, "trips", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTrip(data);

        if (data.location?.lat && data.location?.lng) {
          setTripLocation({
            lat: data.location.lat,
            lng: data.location.lng,
          });
        }
      }
    };

    fetchTrip();
  }, [id]);

  // =============================
  // 📌 ACTIVITIES
  // =============================
  useEffect(() => {
    const q = query(
      collection(db, "activities"),
      where("tripId", "==", id),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setActivities(data);
    });

    return () => unsubscribe();
  }, [id]);

  // =============================
  // 📌 DAYS
  // =============================
  const getDays = () => {
    if (!trip) return [];

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const days = [];
    let current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // =============================
  // 📌 ADD
  // =============================
  const handleAdd = async (dayIndex, place) => {
    if (!place) return;

    await addDoc(collection(db, "activities"), {
      tripId: id,
      day: dayIndex,
      place: place.name,
      location: {
        lat: place.lat,
        lng: place.lng,
      },
      order: Date.now(),
    });

    setSelectedDay(null);
  };

  // =============================
  // 📌 DELETE
  // =============================
  const handleDelete = async (activityId) => {
    await deleteDoc(doc(db, "activities", activityId));
  };

  // =============================
  // 📌 REORDER
  // =============================
  const handleReorder = async (items, dayIndex) => {
    setActivities((prev) => {
      const other = prev.filter((a) => a.day !== dayIndex);

      const updated = items.map((item, index) => ({
        ...item,
        order: index + dayIndex * 1000,
      }));

      return [...other, ...updated];
    });

    await Promise.all(
      items.map((item, index) =>
        updateDoc(doc(db, "activities", item.id), {
          order: index + dayIndex * 1000,
        })
      )
    );
  };

  // =============================
  // LOADING
  // =============================
  if (!trip) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  // =============================
  // UI
  // =============================
  return (
    <Box sx={{ minHeight: "100vh", background: "#a4a6af" }}>
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F1A8A, #6a4cff)",
          color: "#fff",
          px: 5,
          py: 4,
          borderRadius: "20px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/")} sx={{ color: "#fff" }}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4">{trip.name}</Typography>
        </Box>

        <Typography sx={{ mt: 1 }}>📍 {trip.destination}</Typography>
        <Typography>
          📅 {trip.startDate} → {trip.endDate}
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box sx={{ mt: -3, px: 5, pb: 5 }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* LEFT */}
          <Box sx={{ flex: 2 }}>
            {/* TAB */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              {["📅 Lịch trình", "🏨 Booking", "💰 Chi phí"].map(
                (t, i) => (
                  <Box
                    key={i}
                    onClick={() => setTab(i)}
                    sx={{
                      px: 3,
                      py: 1.2,
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: tab === i ? "#6a4cff" : "#eee",
                      color: tab === i ? "#fff" : "#333",
                    }}
                  >
                    {t}
                  </Box>
                )
              )}
            </Box>

            {/* TAB CONTENT */}
            {tab === 0 && (
              <>
                <NearbySuggestions
                  places={nearbyPlaces}
                  onAdd={async (p) => {
                    if (selectedDay === null) {
                      alert("Chọn ngày trước!");
                      return;
                    }

                    const res = await fetch(
                      `https://rsapi.goong.io/Place/Detail?place_id=${p.place_id}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`
                    );

                    const data = await res.json();
                    const loc = data.result.geometry.location;

                    handleAdd(selectedDay, {
                      name: p.description,
                      lat: loc.lat,
                      lng: loc.lng,
                    });
                  }}
                />

                <Planner
                  getDays={getDays}
                  activities={activities}
                  tripId={id}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  activityText={activityText}
                  setActivityText={setActivityText}
                  handleAdd={handleAdd}
                  handleDelete={handleDelete}
                  handleReorder={handleReorder}
                  selectedPlaceByDay={selectedPlaceByDay}
                  setSelectedPlaceByDay={setSelectedPlaceByDay}
                />

                <Note tripId={id} />
              </>
            )}

            {tab === 1 && <BookingTab tripId={id} />}

            {tab === 2 && (
              <Budget
                tripId={id}
                startDate={trip.startDate}
                endDate={trip.endDate}
              />
            )}
          </Box>

          {/* RIGHT MAP */}
          <Box sx={{ flex: 1.2, height: "80vh" }}>
            <MapView
              activities={activities}
              tripLocation={tripLocation}
              hotels={nearbyHotels}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}