const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/", (req, res) => {
  res.send("🚀 RepoReady API is running");
});

app.use("/api", analyzeRoutes);

module.exports = app;