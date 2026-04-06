import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import { getDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseDetailModal from "./ExpenseDetailModal";

export default function Budget({ tripId, startDate, endDate }) {
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  // 🔥 LOAD DATA
  useEffect(() => {
    const q = query(collection(db, "expenses"), where("tripId", "==", tripId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });

    return () => unsubscribe();
  }, [tripId]);
  useEffect(() => {
    const loadBudget = async () => {
      const docRef = doc(db, "budgets", tripId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setBudget(snap.data().amount);
      }
    };

    loadBudget();
  }, [tripId]);
  // 🔥 ADD
  const handleSave = async (data) => {
    await addDoc(collection(db, "expenses"), {
      ...data,
      tripId,
      createdAt: new Date(),
    });
  };

  // 🔥 CALC
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percent = budget ? Math.min((total / budget) * 100, 100) : 0;
  const remaining = budget ? budget - total : null;

  return (
    <Box sx={{ mt: 6, p: 3, borderRadius: 5, background: "#e9ecf2" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        💰 Ngân sách
      </Typography>

      {/* 🔥 HEADER */}
      <Box
        sx={{
          display: "flex",
          borderRadius: 5,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #ddd",
        }}
      >
        {/* LEFT */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography sx={{ fontSize: 14, color: "#666" }}>
            Tổng chi tiêu
          </Typography>

          {/* TEXT */}
          {!editingBudget ? (
            <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
              {total.toLocaleString()} VND
              {budget && (
                <span style={{ color: "#999", fontWeight: 500 }}>
                  {" "}
                  / {budget.toLocaleString()}
                </span>
              )}
            </Typography>
          ) : (
            <TextField
              size="small"
              placeholder="Nhập ngân sách"
              value={budgetInput}
              onChange={(e) => {
                setBudgetInput(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              sx={{ mt: 1 }}
            />
          )}

          {/* REMAINING */}
          {budget && !editingBudget && (
            <Typography sx={{ fontSize: 13, color: "#888", mt: 1 }}>
              Còn lại: {remaining.toLocaleString()} VND
            </Typography>
          )}

          {/* ACTION */}
          {!editingBudget ? (
            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                color: "#1976d2",
                cursor: "pointer",
              }}
              onClick={() => setEditingBudget(true)}
            >
              {budget ? "Sửa ngân sách" : "Đặt chi phí"}
            </Typography>
          ) : (
            <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
              <Typography
                sx={{ color: "#1976d2", cursor: "pointer" }}
                onClick={async () => {
                  if (!budgetInput || Number(budgetInput) <= 0) {
                    setError("Vui lòng nhập số tiền hợp lệ");
                    return;
                  }

                  const value = Number(budgetInput);

                  await setDoc(doc(db, "budgets", tripId), {
                    amount: value,
                  });

                  setBudget(value);
                  setEditingBudget(false);
                  setBudgetInput("");
                }}
              >
                Lưu
              </Typography>

              <Typography
                sx={{ color: "#999", cursor: "pointer" }}
                onClick={() => {
                  setEditingBudget(false);
                  setBudgetInput("");
                }}
              >
                Huỷ
              </Typography>
            </Box>
          )}

          {/* 🔥 PROGRESS */}
          {budget && (
            <Box
              sx={{
                mt: 2,
                height: 10,
                background: "#eee",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${percent}%`,
                  height: "100%",
                  background:
                    percent > 100
                      ? "#ef4444"
                      : percent > 80
                        ? "#f59e0b"
                        : "#4f46e5",
                  transition: "0.3s",
                }}
              />
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* RIGHT */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 1 }}
            onClick={() => setOpen(true)}
          >
            + Thêm chi phí
          </Button>

          <Button fullWidth onClick={() => setOpenDetail(true)}>
            Xem chi tiết
          </Button>
        </Box>
      </Box>

      {/* 🔥 LIST */}
      <Box sx={{ mt: 3 }}>
        {expenses.map((e) => (
          <Box
            key={e.id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 5,
              background: "#fff",
              border: "1px solid #eee",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {e.category?.label}
                </Typography>

                <Typography>{e.amount.toLocaleString()} đ</Typography>

                <Typography sx={{ fontSize: 12, color: "#999" }}>
                  {e.date ? new Date(e.date).toLocaleDateString("vi-VN") : ""}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#666" }}>
                  {e.note}
                </Typography>
              </Box>

              <IconButton onClick={() => deleteDoc(doc(db, "expenses", e.id))}>
                <DeleteIcon sx={{ color: "#ff4d4f" }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* 🔥 MODALS */}
      <ExpenseDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        expenses={expenses}
        startDate={startDate}
        endDate={endDate}
      />

      <AddExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        startDate={startDate}
        endDate={endDate}
      />
    </Box>
  );
}
