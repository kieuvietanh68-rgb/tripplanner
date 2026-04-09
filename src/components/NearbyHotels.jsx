import { Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function NearbyHotels({ hotels, onAdd }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        background: "#e9ecf2",
        mb: 3,
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 2 }}>
        🏨 Gợi ý khách sạn gần đây
      </Typography>

      {hotels.slice(0, 5).map((h, i) => (
        <Box
          key={i}
          sx={{
            p: 2,
            mb: 1.5,
            borderRadius: 2,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "0.2s",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <LocationOnIcon color="primary" />

            <Typography sx={{ fontSize: 14 }}>
              {h.description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              background: "#6a4cff",
              "&:hover": { background: "#5a3ee0" },
            }}
            onClick={() => onAdd(h)}
          >
            Thêm
          </Button>
        </Box>
      ))}
    </Box>
  );
}