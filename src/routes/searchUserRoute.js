import { Router } from "express";
import { getUserPosts, postUsers } from "../controllers/usersSearch.js";
import { validateToken } from "../middlewares/validateToken.js";

const searchUserRoute = Router();

searchUserRoute.get("/user/:id", validateToken, getUserPosts);
searchUserRoute.post("/srcuser", postUsers);

export default searchUserRoute;
