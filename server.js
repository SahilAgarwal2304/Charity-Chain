const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    projectName: "CharityChain dApp",
    timestamp: new Date().toISOString(),
  });
});

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log("==================================================");
  console.log(`CharityChain Frontend Server is running!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log("==================================================");
});
