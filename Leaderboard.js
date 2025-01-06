import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null);

  // Initialize Socket.IO
  const socket = io("http://localhost:5000"); // Update the URL for production

  useEffect(() => {
    // Fetch leaderboard initially
    fetchLeaderboard();

    // Listen for real-time leaderboard updates
    socket.on("update-leaderboard", fetchLeaderboard);

    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/leaderboard");
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const entryToDelete = leaderboard.find((entry) => entry._id === id);
      if (!entryToDelete) return;

      setLastDeleted(entryToDelete); // Save entry for undo
      await axios.delete(`http://localhost:5000/leaderboard/${id}`);
      socket.emit("leaderboard-updated"); // Notify other clients of the update
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const undoDelete = async () => {
    if (!lastDeleted) return;

    try {
      await axios.post("http://localhost:5000/leaderboard", lastDeleted);
      setLastDeleted(null); // Clear the last deleted
      socket.emit("leaderboard-updated"); // Notify other clients of the update
    } catch (error) {
      console.error("Error undoing delete:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <button onClick={undoDelete} disabled={!lastDeleted}>
        Undo Last Delete
      </button>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry._id}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>
                <button onClick={() => deleteEntry(entry._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
