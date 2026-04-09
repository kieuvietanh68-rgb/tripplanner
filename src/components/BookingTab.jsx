import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

import BookingModal from "./BookingModal";

export default function BookingTab({ tripId }) {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔥 LOAD BOOKINGS
  useEffect(() => {
    const q = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
    });

    return () => unsubscribe();
  }, [tripId]);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
  };

  // 🔥 FILTER
  const flights = bookings.filter((b) => b.type === "flight");
  const hotels = bookings.filter((b) => b.type === "hotel");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "16px",
        background: "#e9ecf2",
      }}
    >
      {/* HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        🏨 Booking
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          mb: 3,
          background: "linear-gradient(135deg,#6a4cff,#8f6bff)",
          borderRadius: 2,
        }}
      >
        + Thêm booking
      </Button>

      {/* ✈️ FLIGHT */}
      <Typography sx={{ fontWeight: 600, mb: 1 }}>
        ✈️ Vé máy bay
      </Typography>

      {flights.length === 0 && (
        <Typography sx={{ color: "#777", mb: 2 }}>
          Chưa có dữ liệu
        </Typography>
      )}

      {flights.map((f) => (
        <Card key={f.id} sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>
                  {f.airline} ({f.flightCode})
                </Typography>

                <Typography>
                  {f.from} → {f.to}
                </Typography>

                <Typography fontSize={13} color="gray">
                  {f.departTime} → {f.arriveTime}
                </Typography>

                {f.seat && <Typography>Ghế: {f.seat}</Typography>}
                {f.price && <Typography>💰 {f.price}</Typography>}
                {f.note && <Typography>📝 {f.note}</Typography>}
              </Box>

              <IconButton onClick={() => handleDelete(f.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* 🏨 HOTEL */}
      <Typography sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
        🏨 Khách sạn
      </Typography>

      {hotels.length === 0 && (
        <Typography sx={{ color: "#777" }}>
          Chưa có dữ liệu
        </Typography>
      )}

      {hotels.map((h) => (
        <Card key={h.id} sx={{ mb: 2, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>
                  {h.hotelName}
                </Typography>

                <Typography>{h.address}</Typography>

                <Typography fontSize={13} color="gray">
                  {h.checkIn} → {h.checkOut}
                </Typography>

                {h.roomType && (
                  <Typography>Phòng: {h.roomType}</Typography>
                )}

                {h.price && <Typography>💰 {h.price}</Typography>}

                {h.note && <Typography>📝 {h.note}</Typography>}
              </Box>

              <IconButton onClick={() => handleDelete(h.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* MODAL */}
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        tripId={tripId}
      />
    </Box>
  );
}