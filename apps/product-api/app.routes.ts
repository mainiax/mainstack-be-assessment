import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import productRoutes from "./products/product.routes";

const appRoutesV1: Router = Router();

appRoutesV1.use("/auth", authRoutes);
appRoutesV1.use("/products", productRoutes);

export { appRoutesV1 };
