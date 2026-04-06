import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart({ expenses }) {
  // 👉 group theo category
  const grouped = {};

  expenses.forEach((e) => {
    const key = e.category?.label || "Khác";
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += e.amount;
  });

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        {/* 👉 trục X = tiền */}
        <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />

        {/* 👉 trục Y = category */}
        <YAxis type="category" dataKey="name" width={120} />

        <Tooltip formatter={(v) => v.toLocaleString() + " đ"} />

        <Bar
          dataKey="value"
          fill="#6366f1" // 🔥 màu đẹp
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
