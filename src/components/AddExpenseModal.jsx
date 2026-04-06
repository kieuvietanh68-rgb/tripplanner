import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import CategoryModal from "./CategoryModal";

const categories = [
  { key: "flight", label: "✈️ Vé máy bay" },
  { key: "hotel", label: "🏨 Khách sạn" },
  { key: "car", label: "🚗 Thuê xe" },
  { key: "transport", label: "🚆 Di chuyển" },
  { key: "food", label: "🍜 Ăn uống" },
  { key: "drink", label: "🍹 Đồ uống" },
  { key: "sight", label: "🏛️ Tham quan" },
  { key: "activity", label: "🎯 Hoạt động" },
  { key: "shopping", label: "🛍️ Mua sắm" },
  { key: "fuel", label: "⛽ Xăng xe" },
  { key: "grocery", label: "🛒 Tạp hoá" },
  { key: "other", label: "📦 Khác" },
];

export default function AddExpenseModal({
  open,
  onClose,
  onSave,
  startDate,
  endDate,
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  return (
    <>
      <Box sx={overlay}>
        <Box sx={modal}>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Thêm chi phí
          </Typography>

          <TextField
            fullWidth
            label="Số tiền"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={input}
          />

          <Box sx={select} onClick={() => setOpenCategory(true)}>
            {category ? category.label : "Chọn hạng mục"}
          </Box>

          <TextField
            fullWidth
            label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={input}
          />

          <TextField
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={input}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                // 🔥 VALIDATE DATE
                if (date) {
                  const d = new Date(date);
                  const start = new Date(startDate);
                  const end = new Date(endDate);

                  if (d < start || d > end) {
                    setError(
                      "Ngày chi tiêu phải nằm trong thời gian chuyến đi",
                    );
                    return;
                  }
                }

                // 🔥 CLEAR ERROR
                setError("");

                // SAVE
                onSave({
                  amount: Number(amount),
                  note,
                  date: date || null,
                  category,
                });

                // RESET
                setAmount("");
                setNote("");
                setDate("");
                setCategory(null);

                onClose();
              }}
            >
              Lưu
            </Button>
            {error && (
              <Typography sx={{ color: "red", mt: 1, fontSize: 13 }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 500,
              }}
              onClick={onClose}
            >
              Huỷ
            </Button>
          </Box>
        </Box>
      </Box>

      <CategoryModal
        open={openCategory}
        onClose={() => setOpenCategory(false)}
        onSelect={setCategory}
        categories={categories}
      />
    </>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 2000,
};

const modal = {
  background: "#fff",
  borderRadius: 24,
  padding: 24,

  width: "90%",
  maxWidth: 360,

  boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
  border: "1px solid #eee",
};

const input = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f3f4f6",
    borderRadius: "14px",
  },
};

const select = {
  mb: 2,
  padding: "14px",
  borderRadius: "14px",
  background: "#f3f4f6",
  border: "1px solid #eee",
  textAlign: "center",
  cursor: "pointer",
  fontWeight: 500,

  "&:hover": {
    background: "#e9ecf2",
  },
};
