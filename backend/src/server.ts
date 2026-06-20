import express from "express";
import cors from "cors";

import taskRoutes from "./routes/task.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World SUCCESS");
});

app.use("/tasks", taskRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});