import { Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function NearbySuggestions({ places, onAdd }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "#e9ecf2",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        mb: 3,
      }}
    >
      {/* HEADER */}
      <Typography sx={{ fontWeight: 700, mb: 2, fontSize: 18 }}>
        🔥 Gợi ý địa điểm lịch sử
      </Typography>

      {/* LIST */}
      {places.slice(0, 6).map((p) => {
        const parts = p.description.split(",");
        const title = parts[0];
        const address = parts.slice(1).join(",");

        return (
          <Box
            key={p.place_id}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              borderRadius: "14px",
              mb: 2,
              background: "#f9fafc",
              transition: "0.25s",
              "&:hover": {
                background: "#eef2ff",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              },
            }}
          >
            {/* IMAGE */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #6a4cff, #8f7bff)",
                flexShrink: 0,
              }}
            />

            {/* TEXT */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 15,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "#6a4cff" }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#666",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {address}
                </Typography>
              </Box>
            </Box>

            {/* BUTTON */}
            <Button
              variant="contained"
              size="small"
              onClick={() => onAdd(p)}
              sx={{
                borderRadius: "10px",
                height: "fit-content",
                textTransform: "none",
                background: "#6a4cff",
                px: 2,
                "&:hover": {
                  background: "#5a3ee0",
                },
              }}
            >
              + Thêm
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}