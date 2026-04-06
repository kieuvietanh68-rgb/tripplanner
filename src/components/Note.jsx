import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function Note({ tripId }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // 🔥 LOAD NOTES
  useEffect(() => {
    const q = query(collection(db, "notes"), where("tripId", "==", tripId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(data);
    });

    return () => unsubscribe();
  }, [tripId]);

  // 🔥 SAVE
  const handleSave = async () => {
    if (!content.trim()) {
      setError("⚠️ Vui lòng nhập nội dung!");
      return;
    }

    await addDoc(collection(db, "notes"), {
      tripId,
      title,
      content,
      createdAt: new Date(),
    });

    setTitle("");
    setContent("");
    setError("");
  };

  // 🔥 CANCEL
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setError("");
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  return (
    <Box
      sx={{
        mt: 6,
        p: 3,
        borderRadius: "16px",
        background: "#f5f6fa",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      {/* HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        📝 Ghi chú
      </Typography>

      {/* FORM */}
      <Box
        sx={{
          p: 2,
          border: "1px solid #fff",
          borderRadius: "12px",
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 2,

            // 🔥 nền input
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              borderRadius: "8px",
            },

            // 🔥 border
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ddd",
            },

            // 🔥 hover
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#aaa",
            },

            // 🔥 focus
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6a4cff",
            },
          }}
        />

        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              borderRadius: "8px",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ddd",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#aaa",
            },

            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6a4cff",
            },
          }}
        />

        {/* ERROR */}
        {error && <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>}

        {/* BUTTON */}
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: "#6a4cff",
              "&:hover": { background: "#593be0" },
            }}
            onClick={handleSave}
          >
            💾 Lưu
          </Button>

          <Button variant="outlined" onClick={handleCancel}>
            Huỷ
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* LIST */}
      <Box sx={{ mt: 3 }}>
        {notes.length === 0 ? (
          <Typography sx={{ opacity: 0.6 }}>Chưa có ghi chú nào</Typography>
        ) : (
          notes.map((note) => (
            <Box
              key={note.id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "12px",
                background: "#fff", // 🔥 nền trắng
                border: "1px solid #e0e0e0",

                // 🔥 shadow nhẹ
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",

                // 🔥 hover nổi lên
                transition: "0.2s",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#222",
                    }}
                  >
                    {note.title || "Không tiêu đề"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "#555",
                    }}
                  >
                    {note.content}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#999",
                      mt: 0.5,
                    }}
                  >
                    {new Date(note.createdAt?.seconds * 1000).toLocaleString()}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => handleDelete(note.id)}
                  sx={{
                    "&:hover": {
                      background: "#ffecec",
                    },
                  }}
                >
                  <DeleteIcon sx={{ color: "#ff4d4f" }} />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
