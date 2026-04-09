import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export default function BookingModal({ open, onClose, tripId }) {
  const [type, setType] = useState("flight");

  const [form, setForm] = useState({
    airline: "",
    flightCode: "",
    from: "",
    to: "",
    departTime: "",
    arriveTime: "",
    seat: "",
    price: "",
    note: "",

    hotelName: "",
    address: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    hotelPrice: "",
  });

  const handleSave = async () => {
    try {
      // ✈️ FLIGHT
      if (type === "flight") {
        if (!form.airline || !form.from || !form.to) {
          alert("Vui lòng nhập đủ thông tin chuyến bay");
          return;
        }

        await addDoc(collection(db, "bookings"), {
          tripId,
          type: "flight",
          airline: form.airline,
          flightCode: form.flightCode,
          from: form.from,
          to: form.to,
          departTime: form.departTime,
          arriveTime: form.arriveTime,
          seat: form.seat,
          price: form.price,
          note: form.note,
          createdAt: Date.now(),
        });
      }

      // 🏨 HOTEL
      if (type === "hotel") {
        if (!form.hotelName || !form.checkIn || !form.checkOut) {
          alert("Vui lòng nhập đủ thông tin khách sạn");
          return;
        }

        await addDoc(collection(db, "bookings"), {
          tripId,
          type: "hotel",
          hotelName: form.hotelName,
          address: form.address,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          roomType: form.roomType,
          price: form.hotelPrice,
          note: form.note,
          createdAt: Date.now(),
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogContent
    sx={{
      p: 4,
      borderRadius: "20px",
      background: "#f8f9fd",
    }}
  >
    {/* TITLE */}
    <Typography
      variant="h5"
      sx={{
        mb: 3,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      ✨ Thêm Booking
    </Typography>

    {/* TYPE */}
    <TextField
      select
      fullWidth
      value={type}
      onChange={(e) => setType(e.target.value)}
      sx={{
        mb: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          background: "#fff",
        },
      }}
    >
      <MenuItem value="flight">✈️ Vé máy bay</MenuItem>
      <MenuItem value="hotel">🏨 Khách sạn</MenuItem>
    </TextField>

    {/* ================= ✈️ FLIGHT ================= */}
    {type === "flight" && (
      <Box
        sx={{
          p: 3,
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2}>
          {[
            { label: "Hãng bay", key: "airline" },
            { label: "Mã chuyến bay", key: "flightCode" },
            { label: "Điểm đi", key: "from" },
            { label: "Điểm đến", key: "to" },
          ].map((item) => (
            <Grid item xs={6} key={item.key}>
              <TextField
                label={item.label}
                fullWidth
                sx={{ input: { background: "#fafafa" } }}
                onChange={(e) =>
                  setForm({ ...form, [item.key]: e.target.value })
                }
              />
            </Grid>
          ))}

          <Grid item xs={6}>
            <TextField
              type="datetime-local"
              label="Khởi hành"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, departTime: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="datetime-local"
              label="Đến nơi"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, arriveTime: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Số ghế"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, seat: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Giá vé"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              fullWidth
              multiline
              rows={2}
              sx={{ textarea: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Box>
    )}

    {/* ================= 🏨 HOTEL ================= */}
    {type === "hotel" && (
      <Box
        sx={{
          p: 3,
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Tên khách sạn"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, hotelName: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Địa chỉ"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="date"
              label="Check-in"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, checkIn: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="date"
              label="Check-out"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, checkOut: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Loại phòng"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, roomType: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Giá"
              fullWidth
              sx={{ input: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, hotelPrice: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ghi chú"
              fullWidth
              multiline
              rows={2}
              sx={{ textarea: { background: "#fafafa" } }}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Box>
    )}

    {/* BUTTON */}
    <Box sx={{ mt: 4 }}>
      <Button
        fullWidth
        variant="contained"
        sx={{
          background: "linear-gradient(135deg,#6a4cff,#8f6bff)",
          py: 1.6,
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "15px",
          boxShadow: "0 6px 20px rgba(106,76,255,0.4)",
        }}
        onClick={handleSave}
      >
        LƯU
      </Button>

      <Button
        fullWidth
        sx={{
          mt: 1.5,
          color: "#666",
          fontWeight: 500,
        }}
        onClick={onClose}
      >
        HUỶ
      </Button>
    </Box>
  </DialogContent>
</Dialog>
  );
}