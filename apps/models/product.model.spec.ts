import mongoose from "mongoose";
import Product from "./product.model";
import { PaginationParams } from "../product-api/shared/types";

const testProduct = {
  name: "Test Product",
  price: 10.99,
  category: "Test Category",
  description: "Test Description",
  stock: 100,
  imageUrl: "http://example.com/image.jpg",
};

const setupDatabase = async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    dbName: "product-db-test",
  });
  await Product.deleteMany({});
};

const teardownDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};

describe("Product Model", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it("should create and save a product successfully", async () => {
    const productData = { ...testProduct };
    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(testProduct.name);
    expect(savedProduct.price).toBe(testProduct.price);
    expect(savedProduct.category).toBe(testProduct.category);
    expect(savedProduct.description).toBe(testProduct.description);
    expect(savedProduct.stock).toBe(testProduct.stock);
    expect(savedProduct.imageUrl).toBe(testProduct.imageUrl);
  });

  it("should not save a product without a required field", async () => {
    const productData = {
      price: testProduct.price,
      category: testProduct.category,
      description: testProduct.description,
      stock: testProduct.stock,
      imageUrl: testProduct.imageUrl,
    };

    const product = new Product(productData);

    let err: any;
    try {
      await product.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it("should paginate products", async () => {
    await Product.insertMany([
      { ...testProduct, name: "Product 1" },
      { ...testProduct, name: "Product 2" },
      { ...testProduct, name: "Product 3" },
    ]);

    const filter = {};
    const paginationParams: PaginationParams = {
      page: 1,
      limit: 2,
    };

    const result = await Product.paginate(filter, paginationParams);

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(3);
    expect(result.count).toBe(2);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(2);
  });

  it("should soft delete a product", async () => {
    const product = new Product(testProduct);
    await product.save();

    await product.delete();

    const foundProduct = await Product.findOne({ _id: product._id });

    expect(foundProduct).toBeNull();

    const deletedProduct = await Product.findOneDeleted({
      _id: product._id,
    });

    expect(deletedProduct).not.toBeNull();
    expect(deletedProduct?.deleted).toBe(true);
  });

  it("should correctly transform the JSON representation", async () => {
    const productData = { ...testProduct };
    const product = new Product(productData);
    const savedProduct = await product.save();
    const jsonProduct = savedProduct.toJSON();

    expect(jsonProduct._id).toBeDefined();
    expect(jsonProduct.name).toBe(testProduct.name);
    expect(jsonProduct.price).toBe(testProduct.price);
    expect(jsonProduct.category).toBe(testProduct.category);
    expect(jsonProduct.description).toBe(testProduct.description);
    expect(jsonProduct.stock).toBe(testProduct.stock);
    expect(jsonProduct.imageUrl).toBe(testProduct.imageUrl);

    expect(jsonProduct.deleted).toBeUndefined();
    expect(jsonProduct.deletedAt).toBeUndefined();
    expect(jsonProduct.__v).toBeUndefined();
  });
});
