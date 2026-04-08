import { Box, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GoongPlaceSearch from "./GoongPlaceSearch";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function DayItem({
  day,
  dayIndex,
  activities,
  tripId,
  selectedDay,
  setSelectedDay,
  activityText,
  setActivityText,
  selectedPlace,
  setSelectedPlace,
  handleAdd,
  handleDelete,
  handleReorder,
}) {
  const dayActivities = activities
    .filter((a) => a.tripId === tripId && a.day === dayIndex)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Box
      sx={{
        ml: 2,
        p: 2,
        borderRadius: "12px",
        background: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <Typography sx={{ fontWeight: 700 }}>Day {dayIndex + 1}</Typography>

      <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
        {new Date(day).toLocaleDateString("vi-VN")}
      </Typography>

      {/* BUTTON */}
      <Button
        variant="outlined"
        size="small"
        onClick={() =>
          setSelectedDay(selectedDay === dayIndex ? null : dayIndex)
        }
        sx={{ mt: 1 }}
      >
        + Thêm địa điểm
      </Button>

      {/* INPUT */}
      {selectedDay === dayIndex && (
        <Box sx={{ mt: 2 }}>
          <GoongPlaceSearch
            onSelect={(place) => {
              console.log("SELECTED:", place);
              setActivityText(place.name);
              setSelectedPlace(place);
            }}
          />

          <Button
            variant="contained"
            disabled={!selectedPlace} // 🔥 không cho bấm khi chưa chọn
            onClick={() => {
              if (!selectedPlace) {
                alert("⚠️ Chọn địa điểm từ danh sách!");
                return;
              }

              console.log("SAVE:", selectedPlace);

              // 🔥 clone để tránh mất reference
              handleAdd(dayIndex, { ...selectedPlace });
            }}
            sx={{ mt: 1 }}
          >
            Lưu
          </Button>
        </Box>
      )}

      {/* EMPTY */}
      {dayActivities.length === 0 && (
        <Typography sx={{ mt: 1, opacity: 0.6 }}>
          Chưa có địa điểm nào
        </Typography>
      )}

      {/* DRAG DROP */}
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;

          const items = Array.from(dayActivities);
          const [moved] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, moved);

          handleReorder(items);
        }}
      >
        <Droppable droppableId={`day-${dayIndex}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {dayActivities.map((a, i) => (
                <Draggable key={a.id} draggableId={a.id} index={i}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            borderRadius: "10px",
                            background: "#fff",
                            border: "1px solid #eee",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <Box
                            {...provided.dragHandleProps}
                            sx={{
                              cursor: "grab",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography>☰</Typography>

                            <Typography sx={{ fontWeight: 500 }}>
                              {i + 1}. 📍 {a.place}
                            </Typography>
                          </Box>

                          <IconButton onClick={() => handleDelete(a.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
