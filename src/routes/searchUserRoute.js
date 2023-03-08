import { Router } from "express";
import { getUserPosts } from "../controllers/usersSearch.js";
import { validateToken } from "../middlewares/validateToken.js";

const searchUserRoute = Router();

searchUserRoute.get("/user/:id", validateToken, getUserPosts);

export default searchUserRoute;
