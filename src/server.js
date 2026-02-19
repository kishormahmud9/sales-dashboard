import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mainRoutes from "./routes/routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Main Router
app.use("/api/v1", mainRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Sales Dashboard API is running...");
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

