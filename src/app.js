import express, { json } from "express";
import cors from "cors";
import { db } from "./config/database.js";
import searchUserRoute from "./routes/searchUserRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(json());

app.use([searchUserRoute]);

app.get("/teste", async (req, res) => {
  const promise = await db.query("SELECT * FROM users;");

  res.send(promise);
});

app.listen(PORT, () => console.log("Server On"));
