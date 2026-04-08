import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Planner from "../components/Planner";
import { updateDoc } from "firebase/firestore";
import Note from "../components/Note";
import Budget from "../components/Budget";
import MapView from "../components/MapView";
import { query, where, orderBy } from "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { Box, Typography } from "@mui/material";

export default function TripDetail() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tripLocation, setTripLocation] = useState(null);
  const [tab, setTab] = useState("planner");
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [activityText, setActivityText] = useState("");

  // 🔥 FIX: lưu theo từng day
  const [selectedPlaceByDay, setSelectedPlaceByDay] = useState({});

  const [selectedDay, setSelectedDay] = useState(null);
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
  // 🔥 totalDays safe
  const totalDays = trip
    ? Math.ceil(
        (new Date(trip.endDate) - new Date(trip.startDate)) /
          (1000 * 60 * 60 * 24),
      ) + 1
    : 1;

  // 🔥 reorder
  const handleReorder = async (items) => {
    try {
      await Promise.all(
        items.map((item, index) =>
          updateDoc(doc(db, "activities", item.id), {
            order: index,
          }),
        ),
      );
    } catch (err) {
      console.error("Lỗi reorder:", err);
    }
  };

  // 🔥 lấy activities
  useEffect(() => {
    const q = query(
      collection(db, "activities"),
      where("tripId", "==", id),
      orderBy("order", "asc"),
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

  // 🔥 lấy trip
  useEffect(() => {
    const fetchTrip = async () => {
      const docRef = doc(db, "trips", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTrip(data);
        setTripLocation(data.location);
      }
    };

    fetchTrip();
  }, [id]);

  // ✅ ADD PLACE (FIX CHUẨN)
  const handleAdd = async (dayIndex, place) => {
    if (!place) {
      alert("Chọn địa điểm trước!");
      return;
    }

    const newActivity = {
      tripId: id,
      day: dayIndex,
      place: place.name,
      location: {
        lat: place.lat,
        lng: place.lng,
      },
      order: Date.now(),
    };

    // 🔥 thêm vào Firestore
    const docRef = await addDoc(collection(db, "activities"), newActivity);

    // 🔥 QUAN TRỌNG: update UI ngay
    setActivities((prev) => [...prev, { id: docRef.id, ...newActivity }]);

    console.log("ADD SUCCESS");

    setSelectedPlace(null);
    setSelectedDay(null);
  };

  const handleDelete = async (activityId) => {
    try {
      await deleteDoc(doc(db, "activities", activityId));

      // 🔥 update UI ngay
      setActivities((prev) => prev.filter((a) => a.id !== activityId));

      console.log("DELETE SUCCESS");
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };
  if (!trip) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }
  return (
    <Box sx={{ minHeight: "100vh", background: "#a4a6afff" }}>
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F1A8A 0%, #6a4cff 100%)",
          color: "#fff",
          px: 5,
          py: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/")} sx={{ color: "#fff" }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {trip.name}
          </Typography>
        </Box>

        <Typography sx={{ mt: 1 }}>📍 {trip.destination}</Typography>
        <Typography sx={{ opacity: 0.8 }}>
          📅 {trip.startDate} → {trip.endDate}
        </Typography>
      </Box>

      {/* CONTENT */}
      <Box sx={{ mt: -3, px: 5, pb: 5 }}>
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* LEFT */}
          <Box sx={{ flex: 2 }}>
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

            <Budget
              tripId={id}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />

            <Note tripId={id} />
          </Box>

          {/* RIGHT MAP */}
          <Box
            sx={{
              flex: 1.2,
              position: "sticky",
              top: 100,
              height: "80vh",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <MapView activities={activities} tripLocation={tripLocation} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
