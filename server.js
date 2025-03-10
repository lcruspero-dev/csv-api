const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const path = require("path");
const PORT = process.env.PORT || 3000;
const cors = require("cors");

// Connect to database
connectDB();

const app = express();

/**
 * Each app.use(middleware) is called every time
 * a request is sent to the server
 */

/**
 * This is a built-in middleware function in Express.
 * It parses incoming requests with JSON payloads and is based on body-parser.
 */
app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:4000",
    "http://localhost:3000",
    "http://localhost:5174",
    "https://ticketing-system-puce.vercel.app",
    "http://172.16.7.98:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors());

/**
 * This is a built-in middleware function in Express.
 * It parses incoming requests (Object as strings or arrays) with
 * urlencoded payloads and is based on body-parser.
 */
app.use(express.urlencoded({ extended: false }));

// Routes endpoints
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/memos", require("./routes/memoRoutes"));
app.use("/api/assigns", require("./routes/assignRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/employeeTimes", require("./routes/employeeTimeRoutes"));
app.use(
  "/api/employeeAttendances",
  require("./routes/employeeAttendanceRoutes")
);
app.use("/api/surveys", require("./routes/surveyRoutes"));
app.use("/api/ntes", require("./routes/nteRoutes"));
app.use("/api/userProfiles", require("./routes/userProfileRoutes"));

// Serve frontend time

app.get("/api/current-time", (_req, res) => {
  const currentTime = new Date();
  res.json({
    date: currentTime.toLocaleDateString(),
    time: currentTime.toLocaleTimeString(),
  });
});

app.use(errorHandler);
app.disable("x-powered-by");

/**
 * app.listen()
 * Starts a UNIX socket and listens for connections on the given path.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
