import { Box, Typography } from "@mui/material";

export default function CategoryModal({ open, onClose, onSelect, categories }) {
  if (!open) return null;

  return (
    <Box sx={overlay} onClick={onClose}>
      <Box sx={modal} onClick={(e) => e.stopPropagation()}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Chọn hạng mục</Typography>

        <Box sx={grid}>
          {categories.map((c) => (
            <Box
              key={c.key}
              sx={item}
              onClick={() => {
                onSelect(c);
                onClose();
              }}
            >
              <Typography sx={{ fontSize: 18 }}>
                {c.label.split(" ")[0]}
              </Typography>

              <Typography sx={{ fontSize: 11, mt: 0.5 }}>
                {c.label.split(" ").slice(1).join(" ")}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modal = {
  width: 300,
  maxHeight: "65vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
};

const item = {
  height: 40,
  borderRadius: 10,
  background: "#f5f6fa",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",
  transition: "0.2s",

  "&:hover": {
    background: "#e9ecf2",
  },
};
