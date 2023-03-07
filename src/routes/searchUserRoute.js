import { Router } from "express";
import { searchUser } from "../controllers/usersSearch.js";

const searchUserRoute = Router();

searchUserRoute.post("/searchUser", searchUser);

export default searchUserRoute;
