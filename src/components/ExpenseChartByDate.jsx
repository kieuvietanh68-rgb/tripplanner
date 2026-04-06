import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChartByDate({ expenses }) {
  // 👉 group theo ngày
  const grouped = {};

  expenses.forEach((e) => {
    const key = e.date
      ? new Date(e.date).toLocaleDateString("vi-VN")
      : "Tất cả";

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += e.amount;
  });

  // 👉 convert sang array + sort theo date
  const data = Object.entries(grouped)
    .map(([date, value]) => ({
      date,
      value,
      rawDate:
        date === "Tất cả"
          ? null
          : new Date(date.split("/").reverse().join("-")),
    }))
    .sort((a, b) => {
      if (!a.rawDate) return 1;
      if (!b.rawDate) return -1;
      return a.rawDate - b.rawDate;
    });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        {/* 👉 trục X = tiền */}
        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />

        {/* 👉 trục Y = ngày */}
        <YAxis type="category" dataKey="date" width={100} />

        <Tooltip formatter={(v) => v.toLocaleString() + " đ"} />

        <Bar
          dataKey="value"
          fill="#10b981" // 🔥 màu khác category
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
