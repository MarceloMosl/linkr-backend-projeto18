import express from "express";

import { login, signUp } from "../controllers/log.js";
import validateUser from "../middlewares/validateUser.js";
import validateLogin from "../middlewares/validateLogin.js";

import { loginSchema, signSchema } from "../schemas/loginSchema.js";

const userRoute = express.Router();

userRoute.post("/sign-up", validateUser(signSchema), signUp);
userRoute.post("/", validateLogin(loginSchema), login);

export default userRoute;
