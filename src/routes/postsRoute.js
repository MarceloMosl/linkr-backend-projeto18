import { Router } from "express";
import { editPost, deletePost, CreateNewPost } from "../controllers/posts.js";
import { validateToken } from "../middlewares/validateToken.js";
import { getPosts } from "../controllers/getPosts.js";
import ValidateNewPost from "../middlewares/validadeNewPost.js";

const postsRoute = Router();

postsRoute.patch("/posts/:id",validateToken, editPost);
postsRoute.delete("/posts/:id",validateToken, deletePost);
postsRoute.get("/timeline", validateToken, getPosts);
postsRoute.post("/newpost",validateToken,ValidateNewPost,CreateNewPost)


export default postsRoute;