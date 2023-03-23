import { hash } from "bcrypt";
import { Router } from "express";
import { showHashTags, showPostsHashtag } from "../controllers/hashTags.controller.js";
import { validateToken } from "../middlewares/validateToken.js";

const hashTagsRouter = Router()

hashTagsRouter.get("/hashtags",validateToken, showHashTags)
hashTagsRouter.get("/hashtags/:hashtag",validateToken, showPostsHashtag)


export default hashTagsRouter