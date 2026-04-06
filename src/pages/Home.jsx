import { Box, Typography, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error"

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "trips"), (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTrips(tripsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #4F1A8A 0%, #6a4cff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: "80px",
          background: "#f8f9fb",
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 10, lg: 30 },
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "25px",
            color: "#2d2d2d",
          }}
        >
          ✈️ TripPlanner
        </Typography>
      </Box>

      {/* MAIN */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#ffffff",
          textAlign: "center",
          pt: 10,
        }}
      >
        {/* TITLE */}
        <Typography
          sx={{
            fontSize: "42px",
            fontWeight: 700,
          }}
        >
          Chuyến đi của bạn
        </Typography>

        {/* BLOCK DƯỚI */}
        <Box
          sx={{
            mt: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ICON MAP (đã fix chuẩn) */}
          <Box
            sx={{
              width: "70px",
              height: "70px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 32, color: "#fff" }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mt: 3,
              justifyContent: "center",
            }}
          >
            {trips.length === 0 ? (
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, opacity: 0.95 }}
              >
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                    🧳 Chưa có chuyến đi nào
                  </Typography>

                  <Typography sx={{ mt: 1, opacity: 0.7 }}>
                    Hãy tạo chuyến đi của bạn 🚀
                  </Typography>
                </Box>
              </Typography>
            ) : (
              trips.map((trip) => (
                <Box
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  sx={{
                    width: 280,
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    p: 3,
                    position: "relative",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    color: "#fff",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {trip.name}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{trip.destination}</Typography>
                  <Typography sx={{ mt: 1, fontSize: 14, opacity: 0.8 }}>
                    {trip.startDate} → {trip.endDate}
                  </Typography>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // 👈 QUAN TRỌNG

                      if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                        deleteDoc(doc(db, "trips", trip.id));
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: "#ff4d4f",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>

          {loading ? (
            <Typography sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
          ) : trips.length === 0 ? (
            <Typography
              sx={{
                fontSize: "16px",
                opacity: 0.7,
                mt: 2,
              }}
            >
              Tạo chuyến đi đầu tiên của bạn ngay bây giờ!
            </Typography>
          ) : null}

          <Button
            variant="contained"
            onClick={() => setOpen(true)} // 👈 thêm dòng này
            sx={{
              mt: 4,
              borderRadius: "12px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #7b3fe4, #a66cff)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            }}
          >
            + Tạo chuyến đi
          </Button>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "20px",
            minWidth: "420px",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
            fontSize: "20px",
            pb: 1,
          }}
        >
          Tạo chuyến đi mới
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: "#999",
              "&:hover": {
                color: "#ff4d4f",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* FORM */}
        <DialogContent sx={{ pt: 2 }}>
          {/* Tên chuyến đi */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Tên chuyến đi</Typography>
          <TextField
            fullWidth
            placeholder="VD: Du lịch Đà Lạt"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Điểm đến FULL */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Điểm đến</Typography>
          <TextField
            fullWidth
            placeholder="VD: Đà Lạt, Việt Nam"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Ngày bắt đầu + kết thúc */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Ngày bắt đầu
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Ngày kết thúc
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* BUTTON */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={async () => {
              // 1️⃣ Kiểm tra nhập đủ thông tin
              if (!tripName || !destination || !startDate || !endDate) {
                setSnackbarMessage(
                  "Vui lòng điền đầy đủ thông tin trước khi tạo chuyến đi!",
                );
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              // 2️⃣ Kiểm tra ngày kết thúc >= ngày bắt đầu
              if (new Date(endDate) < new Date(startDate)) {
                setSnackbarMessage(
                  "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!",
                );
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              try {
                await addDoc(collection(db, "trips"), {
                  name: tripName,
                  destination: destination,
                  startDate: startDate,
                  endDate: endDate,
                  createdAt: new Date(),
                });

                setSnackbarMessage("Tạo chuyến đi thành công!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                // reset form
                setOpen(false);
                setTripName("");
                setDestination("");
                setStartDate("");
                setEndDate("");
              } catch (error) {
                console.error("Lỗi:", error);
                setSnackbarMessage("Lưu chuyến đi thất bại. Vui lòng thử lại!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
              }
            }}
            sx={{
              mt: 2,
              borderRadius: "10px",
              textTransform: "none",
              py: 1.5,
              fontSize: "15px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #7b3fe4, #a66cff)",
            }}
          >
            Tạo chuyến đi
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
