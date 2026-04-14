require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 100
});

const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ================= MIDDLEWARE =================

Object.defineProperty(express.request, "query", {
configurable: true,
writable: true
});

app.use(morgan("dev"));
app.use(errorHandler);

app.use(mongoSanitize());
app.use(helmet());
app.use(limiter);
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= ROUTES =================


// Import auth routes



const authRoutes = require("./routes/auth");



// Use auth routes
app.use("/", authRoutes);

const dashboardRoute = require("./routes/dashboard")
app.use("/",dashboardRoute)

const projectsRoute = require("./routes/projects");

 app.use("/",projectsRoute);

 const notificationRoutes = require("./routes/notifications")
 
 app.use("/", notificationRoutes)

const workspaceRoutes = require("./routes/workspace");
app.use(workspaceRoutes);

const fileRoutes = require("./routes/files");
const envRoutes = require("./routes/environment");

app.use("/workspace", fileRoutes);
app.use("/workspace", envRoutes);

const pluginRoutes = require("./routes/plugins")
app.use("/workspace", pluginRoutes)

const pluginRoute = require("./routes/workspace-plugins")
app.use("/workspace", pluginRoute)

const filesRoutes = require("./routes/files")

app.use(filesRoutes)
// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
