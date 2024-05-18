import { Router } from "express";
import {
  getProduct,
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
} from "./product.controller";
import Validator from "../shared/utils/validator";
import { createProductDto, updateProductDto } from "./product.dto";
import multerUpload from "../shared/config/multer.config";
import { authGuard } from "../shared/guards/auth.guard";

const productRoutes: Router = Router();

productRoutes.use(authGuard);

productRoutes.get("/", getProducts);
productRoutes.post(
  "/",
  multerUpload.single("image"),
  Validator(createProductDto),
  createProduct
);
productRoutes.get("/:id", getProduct);
productRoutes.put(
  "/:id",
  multerUpload.single("image"),
  Validator(updateProductDto),
  updateProduct
);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
