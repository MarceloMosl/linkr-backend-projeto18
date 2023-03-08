import { Router } from "express";
import { editPost, deletePost } from "../controllers/posts.js";
import { validateToken } from "../middlewares/validateToken.js";


const postsRoute = Router();

postsRoute.post("/posts/edit",validateToken, editPost);
postsRoute.post("/posts/delete",validateToken, deletePost);


export default postsRoute;
