const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "*"
  })
);
app.use(express.json({ limit: "12mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Something went wrong."
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

module.exports = { app };
