import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import trim from "./middlewares/trim";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.get("/", (_, res) => res.send("Hello World"));
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log("Server is listening on port " + port);

  try {
    await createConnection();
    console.log("Database connected!");
  } catch (err) {
    console.log(err);
  }
});
