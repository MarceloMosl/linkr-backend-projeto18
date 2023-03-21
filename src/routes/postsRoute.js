import { Router } from "express";
import { editPost, deletePost} from "../controllers/posts.js";
import { validateToken } from "../middlewares/validateToken.js";
import { getPosts } from "../controllers/getPosts.js";
import { createPost } from "../controllers/posts.js";
import { postSchema } from "../schemas/postSchema.js";
import {validateSchema} from "../middlewares/validateSchema.js"
const postsRoute = Router();

postsRoute.post("/posts",validateToken,validateSchema(postSchema), createPost);
postsRoute.patch("/posts/:id",validateToken, editPost);
postsRoute.delete("/posts/:id",validateToken, deletePost);
postsRoute.get("/timeline", validateToken, getPosts);

export default postsRoute;