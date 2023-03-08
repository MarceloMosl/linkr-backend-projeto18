import { Router } from "express";
import { editPost } from "../controllers/posts.js";
import { validateToken } from "../middlewares/validateToken.js";


const postsRoute = Router();

postsRoute.post("/editPost",validateToken, editPost);


export default postsRoute;
