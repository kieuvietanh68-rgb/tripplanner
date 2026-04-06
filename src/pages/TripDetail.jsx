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
  const [tab, setTab] = useState("planner");
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [activityText, setActivityText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
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

  // 🔥 Lấy activities
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Lấy expenses
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Lấy trip
  useEffect(() => {
    const fetchTrip = async () => {
      const docRef = doc(db, "trips", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      }
    };

    fetchTrip();
  }, [id]);

  // ✅ ADD PLACE
  const handleAdd = async (dayIndex) => {
    if (!activityText && !selectedPlace) {
      alert("Nhập địa điểm!");
      return;
    }

    await addDoc(collection(db, "activities"), {
      tripId: id, // 🔥 dùng id
      day: dayIndex, // 🔥 dùng tham số truyền vào
      place: selectedPlace.name,

      location: {
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
      },
    });

    setActivityText("");
    setSelectedPlace(null);
    setSelectedDay(null);
  };

  const handleDelete = async (activityId) => {
    await deleteDoc(doc(db, "activities", activityId));
  };

  const handleAddExpense = async (activityId, amount) => {
    await addDoc(collection(db, "expenses"), {
      tripId: id,
      activityId,
      amount: Number(amount),
      createdAt: new Date(),
    });
  };

  if (!trip) return <Typography>Đang tải dữ liệu...</Typography>;

  const getDays = () => {
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
        {/* ROW 1: TITLE + NAVBAR */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => navigate("/")} sx={{ color: "#fff" }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {trip.name}
            </Typography>
          </Box>

          {/* RIGHT: NAVBAR */}
          <Box sx={{ display: "flex", gap: 3 }}>
            {["planner", "booking", "budget", "notes"].map((item) => (
              <Typography
                key={item}
                onClick={() => setTab(item)}
                sx={{
                  cursor: "pointer",
                  fontWeight: tab === item ? 700 : 500,
                  borderBottom:
                    tab === item ? "2px solid #fff" : "2px solid transparent",
                  pb: 0.5,
                  color: "#fff",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                {
                  {
                    planner: "📅 Lịch trình",
                    booking: "✈️ Booking",
                    budget: "💰 Ngân sách",
                    notes: "📝 Ghi chú",
                  }[item]
                }
              </Typography>
            ))}
          </Box>
        </Box>

        {/* ROW 2: INFO */}
        <Typography sx={{ mt: 1, fontSize: 14 }}>
          📍 {trip.destination}
        </Typography>

        <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
          📅 {trip.startDate} → {trip.endDate}
        </Typography>
      </Box>

      {/* DAYS */}
      <Box sx={{ mt: -3, px: 5, pb: 5 }}>
        {tab === "planner" && (
          <Box sx={{ display: "flex", gap: 3 }}>
            {/* 🔥 LEFT */}
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
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
                handleReorder={handleReorder}
              />

              <Budget
                tripId={id}
                startDate={trip.startDate}
                endDate={trip.endDate}
              />

              <Note tripId={id} />
            </Box>

            {/* 🔥 RIGHT - MAP */}
            <Box
              sx={{
                flex: 1.2,
                position: "sticky",
                top: 100,
                height: "80vh",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #eee",
              }}
            >
              <MapView activities={activities} tripLocation={trip.location} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
