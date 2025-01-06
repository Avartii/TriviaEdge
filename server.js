const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/leaderboardDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema({
  username: String,
  score: Number,
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

// Create HTTP server for Socket.IO integration
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust to your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Broadcast leaderboard updates to all clients
  socket.on("leaderboard-updated", () => {
    io.emit("update-leaderboard");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Get leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

// Add entry (Undo functionality)
app.post("/leaderboard", async (req, res) => {
  try {
    const { username, score } = req.body;
    const newEntry = new Leaderboard({ username, score });
    await newEntry.save();
    io.emit("update-leaderboard"); // Notify all clients
    res.status(201).json({ message: "Entry added to leaderboard." });
  } catch (error) {
    res.status(500).json({ message: "Error adding entry" });
  }
});

// Delete entry by ID
app.delete("/leaderboard/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Leaderboard.findByIdAndDelete(id);
    io.emit("update-leaderboard"); // Notify all clients
    res.status(200).json({ message: "Entry deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting entry" });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
