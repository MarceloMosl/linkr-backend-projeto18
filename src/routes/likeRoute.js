import { Router } from "express";
import { likePost } from "../controllers/likes.js";
import { validateToken } from "../middlewares/validateToken.js";

const likeRouter = Router();

likeRouter.post("/like", validateToken, likePost);

export default likeRouter;
