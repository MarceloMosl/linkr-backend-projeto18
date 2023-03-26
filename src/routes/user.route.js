import express from "express";

import { login, signUp, follow, unfollow, followed } from "../controllers/log.js";
import validateUser from "../middlewares/validateUser.js";
import validateLogin from "../middlewares/validateLogin.js";
import { validateToken } from "../middlewares/validateToken.js";

import { loginSchema, signSchema } from "../schemas/loginSchema.js";

const userRoute = express.Router();

userRoute.post("/sign-up", validateUser(signSchema), signUp);
userRoute.post("/", validateLogin(loginSchema), login);
userRoute.post("/user/:id", validateToken, follow )
userRoute.delete("/user/:id", validateToken, unfollow)
userRoute.get("/follow/:id", validateToken, followed)


export default userRoute;
