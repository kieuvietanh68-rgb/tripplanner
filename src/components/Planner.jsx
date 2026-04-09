import { Box, Typography } from "@mui/material";
import DayItem from "./DayItem";

export default function Planner({
  getDays,
  activities,
  tripId,
  selectedDay,
  setSelectedDay,
  activityText,
  setActivityText,
  handleAdd,
  handleDelete,
  handleReorder,
  selectedPlaceByDay,
  setSelectedPlaceByDay,
}) {
  const days = getDays();

  return (
    <Box
      sx={{
        mt: 6,
        p: 3,
        borderRadius: "16px",
        background: "#e9ecf2",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        📅 Lịch trình
      </Typography>

      <Box sx={{ position: "relative", pl: 3 }}>
        <Box
          sx={{
            position: "absolute",
            left: 8,
            top: 0,
            bottom: 0,
            width: "2px",
            background: "#e0e0e0",
          }}
        />

        {days.map((day, index) => (
          <Box key={index} sx={{ position: "relative", mb: 4 }}>
            {/* DOT */}
            <Box
              sx={{
                position: "absolute",
                left: -2,
                top: 6,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#6a4cff",
              }}
            />

            <DayItem
              day={day}
              dayIndex={index}
              tripId={tripId}
              activities={activities}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              activityText={activityText}
              setActivityText={setActivityText}
              handleAdd={handleAdd}
              handleDelete={handleDelete}
              handleReorder={handleReorder}
              selectedPlace={selectedPlaceByDay[index]}
              setSelectedPlace={(place) =>
                setSelectedPlaceByDay((prev) => ({
                  ...prev,
                  [index]: place,
                }))
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
