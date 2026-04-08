import { useState } from "react";
import { Box } from "@mui/material";
import ExpenseChart from "./ExpenseChart";
import ExpenseChartByDate from "./ExpenseChartByDate";

export default function ExpenseDetailModal({ open, onClose, expenses }) {
  const [tab, setTab] = useState("category");

  if (!open) return null;

  // 👉 GROUP BY CATEGORY
  const groupByCategory = () => {
    const map = {};

    expenses.forEach((e) => {
      const key = e.category?.label || "Khác";
      if (!map[key]) map[key] = 0;
      map[key] += e.amount;
    });

    return map;
  };

  // 👉 GROUP BY DATE
  const groupByDate = () => {
    const map = {};

    expenses.forEach((e) => {
      const key = e.date
        ? new Date(e.date).toLocaleDateString("vi-VN")
        : "Không có ngày";

      if (!map[key]) map[key] = 0;
      map[key] += e.amount;
    });

    return map;
  };

  const data = tab === "category" ? groupByCategory() : groupByDate();

  return (
    <Box sx={overlay} onClick={onClose}>
      <Box sx={modal} onClick={(e) => e.stopPropagation()}>
        {/* 🔥 TAB */}
        <Box sx={tabContainer}>
          <Box
            sx={tabItem(tab === "category")}
            onClick={() => setTab("category")}
          >
            Theo hạng mục
          </Box>

          <Box sx={tabItem(tab === "date")} onClick={() => setTab("date")}>
            Theo ngày
          </Box>
        </Box>

        {/* 🔥 CONTENT */}
        <Box sx={{ mt: 3 }}>
          {/* 👉 TAB THEO HẠNG MỤC */}
          {tab === "category" && <ExpenseChart expenses={expenses} />}

          {/* 👉 TAB THEO NGÀY */}
          {tab === "date" && <ExpenseChartByDate expenses={expenses} />}
        </Box>
      </Box>
    </Box>
  );
}
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modal = {
  width: "90%",
  maxWidth: 380,
  background: "#fff",
  borderRadius: 20,
  padding: 20,
};

const tabContainer = {
  display: "flex",
  background: "#f3f4f6",
  borderRadius: 12,
  padding: 4,
};

const tabItem = (active) => ({
  flex: 1,
  textAlign: "center",
  padding: "10px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  background: active ? "#fff" : "transparent",
  boxShadow: active ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
});

const item = {
  display: "flex",
  justifyContent: "space-between",
  padding: 12,
  borderBottom: "1px solid #eee",
};
