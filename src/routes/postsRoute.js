import { Router } from "express";
import { editPost } from "../controllers/posts.js";

const searchUserRoute = Router();

searchUserRoute.post("/searchUser", searchUser);

export default searchUserRoute;
