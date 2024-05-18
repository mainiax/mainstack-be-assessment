import { Router } from "express";
import { loginUser } from "./auth.controller";
import Validator from "../shared/utils/validator";
import { loginDto } from "./auth.dto";

const authRoutes: Router = Router();

authRoutes.post("/", Validator(loginDto), loginUser);

export default authRoutes;
