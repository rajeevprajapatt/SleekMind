import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connect from "./database/db.js";
import userRoutes from "./routes/user_routes.js"
import projectRouter from './routes/project_routes.js';
import chatRouter from './routes/chats_routes.js'
import aiRouter from './routes/ai_routes.js'
import updateRoutes from './routes/update_routes.js'

const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors(corsOptions)); 

// app.use(cors());
const allowedOrigins = [
  "https://sleekmind.vercel.app",
  "https://sleekmind-kfrkwn6ol-rajeevprajapat43-gmailcoms-projects.vercel.app"  // Vercel preview URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.get("/", (req, res) => {
    return res.json({ msg: "Hello World" });
})
app.get("/ping", (req, res) => res.send("Server is alive"));

app.use("/users", userRoutes);
app.use("/projects", projectRouter);
app.use("/chats",chatRouter);
app.use("/ai", aiRouter);
app.use('/update', updateRoutes)

export default app;

