import { Router } from "express";
import { editPost, deletePost } from "../controllers/posts.js";
import { validateToken } from "../middlewares/validateToken.js";
import { getPosts } from "../controllers/getPosts.js";

const postsRoute = Router();

postsRoute.patch("/posts/:id",validateToken, editPost);
postsRoute.delete("/posts/:id",validateToken, deletePost);
postsRoute.get("/timeline", validateToken, getPosts);


export default postsRoute;