import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import accessCodeRoute from "./routes/accessCode";
import studentRoutes from "./routes/student";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,              
}));

app.use(bodyParser.json());

app.use("/api", accessCodeRoute);
app.use("/api", studentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
