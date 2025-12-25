const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// Serve static files from views (for HTML) and views/css, views/js
app.use(express.static(path.join(__dirname, "views")));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes")); // Handles /login and /register
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/market", require("./routes/marketRoutes")); // Handles /list
app.use("/api/soil-tests", require("./routes/soilRoutes"));
app.use("/api/saved-rentals", require("./routes/savedRentalRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Serve HTML files (Clean URLs)
const { protectPage } = require("./middleware/pageAuthMiddleware");

app.get("/", protectPage, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "web.html"));
});

// Explicit Public Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

const pages = [
  "market-linkage",
  "soil-testing",
  "chatbot",
  "community",
  "renting",
  "profile",
  "web", 
];

pages.forEach((page) => {
  // Protect all internal pages
  app.get(`/${page}`, protectPage, (req, res) => {
    res.sendFile(path.join(__dirname, "views", `${page}.html`));
  });
  app.get(`/${page}.html`, protectPage, (req, res) => {
    res.sendFile(path.join(__dirname, "views", `${page}.html`));
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
