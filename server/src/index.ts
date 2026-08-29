import express from "express";
import cors from "cors";
import gameRoutes from "../routes/gameRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Chaos City server is running!",
  });
});

// 👇 This is important
app.use("/games", gameRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});