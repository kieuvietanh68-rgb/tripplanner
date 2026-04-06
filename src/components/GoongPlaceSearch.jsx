import { useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";

const API_KEY = process.env.REACT_APP_GOONG_API_KEY;

export default function GoongPlaceSearch({ onSelect }) {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⏱ debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);

  // 🔎 gọi API autocomplete
  useEffect(() => {
    if (!debouncedInput) {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${encodeURIComponent(
            debouncedInput,
          )}`,
        );

        const data = await res.json();
        setSuggestions((data.predictions || []).slice(0, 5)); // giới hạn 5 kết quả
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedInput]);

  // 📍 chọn địa điểm
  const handleSelect = async (place) => {
    setInput(place.description);
    setSuggestions([]);

    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${place.place_id}&api_key=${API_KEY}`,
      );

      const data = await res.json();
      const location = data?.result?.geometry?.location;

      if (!location) {
        alert("Không lấy được tọa độ!");
        return;
      }

      onSelect({
        name: place.description,
        lat: location.lat,
        lng: location.lng,
      });
    } catch (err) {
      console.error("Detail error:", err);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập địa điểm..."
      />

      {/* Loading */}
      {loading && (
        <Typography sx={{ mt: 1, fontSize: 13 }}>Đang tìm...</Typography>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            bgcolor: "#fff",
            borderRadius: "8px",
            boxShadow: 3,
            zIndex: 10,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {suggestions.map((item) => (
            <Box
              key={item.place_id}
              onClick={() => handleSelect(item)}
              sx={{
                px: 2,
                py: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              📍 {item.description}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
