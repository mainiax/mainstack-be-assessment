import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Product from "../../models/product.model";
import {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
} from "./product.controller";
import { NotFoundException } from "../shared/utils/exceptions";
import { cloudinaryFileUploader } from "../shared/utils/cloudinary-uploader";
import { createMockResponse } from "../shared/utils/test-utils";

jest.mock("../../models/product.model");
jest.mock("../shared/utils/cloudinary-uploader");

interface CustomRequest extends Omit<Request, "file"> {
  file: { path: string };
}

describe("Product Controller", () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { _id: new mongoose.Types.ObjectId() },
      query: {},
      params: {},
      body: {},
      file: { path: "path/to/image.jpg" },
    } as CustomRequest;
    res = createMockResponse() as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should retrieve products successfully", async () => {
      const mockProducts = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 1,
      };
      (Product.paginate as jest.Mock).mockResolvedValue(mockProducts);

      await getProducts(req as Request, res as Response, next);

      expect(Product.paginate).toHaveBeenCalledWith(
        { user: { $eq: req.user._id } },
        { page: 1, limit: 10 }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors", async () => {
      const error = new Error("Error retrieving products");
      (Product.paginate as jest.Mock).mockRejectedValue(error);

      await getProducts(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getProduct", () => {
    it("should retrieve a product successfully", async () => {
      const mockProduct = { _id: "product_id", name: "Test Product" };
      (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);
      req.params.id = "product_id";

      await getProduct(req as Request, res as Response, next);

      expect(Product.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        user: req.user._id,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should handle product not found", async () => {
      (Product.findOne as jest.Mock).mockResolvedValue(null);
      req.params.id = "product_id";

      await getProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("NotFoundException", () => ({
          message: "product does not exist",
        }))
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Error retrieving product");
      (Product.findOne as jest.Mock).mockRejectedValue(error);
      req.params.id = "product_id";

      await getProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      const mockProduct = { _id: "product_id", name: "Updated Product" };
      (Product.findOneAndUpdate as jest.Mock).mockResolvedValue(mockProduct);
      req.params.id = "product_id";
      req.body = { name: "Updated Product" };

      await updateProduct(req as Request, res as Response, next);

      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should handle product not found", async () => {
      (Product.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      req.params.id = "product_id";
      req.body = { name: "Updated Product" };

      await updateProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("NotFoundException", () => ({
          message: "product does not exist",
        }))
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Error updating product");
      (Product.findOneAndUpdate as jest.Mock).mockRejectedValue(error);
      req.params.id = "product_id";
      req.body = { name: "Updated Product" };

      await updateProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const mockProduct = { _id: "product_id", name: "New Product" };
      (cloudinaryFileUploader as jest.Mock).mockResolvedValue({
        url: "url/to/image.jpg",
      });
      (Product.create as jest.Mock).mockResolvedValue(mockProduct);
      req.body = { name: "New Product" };

      await createProduct(req as Request, res as Response, next);

      expect(cloudinaryFileUploader).toHaveBeenCalledWith(req.file!.path, {
        folder: "product_images",
      });
      expect(Product.create).toHaveBeenCalledWith({
        ...req.body,
        imageUrl: "url/to/image.jpg",
        user: req.user._id,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should handle errors", async () => {
      const error = new Error("Error creating product");
      (cloudinaryFileUploader as jest.Mock).mockRejectedValue(error);

      await createProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      const mockProduct = {
        _id: "product_id",
        name: "Product to delete",
        delete: jest.fn(),
      };
      (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);
      req.params.id = "product_id";

      await deleteProduct(req as Request, res as Response, next);

      expect(Product.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        user: req.user._id,
      });
      expect(mockProduct.delete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should handle product not found", async () => {
      (Product.findOne as jest.Mock).mockResolvedValue(null);
      req.params.id = "product_id";

      await deleteProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new NotFoundException("NotFoundException", () => ({
          message: "product does not exist",
        }))
      );
    });

    it("should handle errors", async () => {
      const error = new Error("Error deleting product");
      (Product.findOne as jest.Mock).mockRejectedValue(error);
      req.params.id = "product_id";

      await deleteProduct(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
