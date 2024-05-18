import { createProductDto, updateProductDto } from "./product.dto";

describe("createProductDto Schema", () => {
  it("should validate a valid product", () => {
    const validData = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      },
    };

    const { error, value } = createProductDto.validate(validData);

    expect(error).toBeUndefined();
    expect(value).toEqual(validData);
  });

  it("should return an error if name is missing", () => {
    const invalidData = {
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"name" is required');
  });

  it("should return an error if price is missing", () => {
    const invalidData = {
      name: "Test Product",
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"price" is required');
  });

  it("should return an error if category is missing", () => {
    const invalidData = {
      name: "Test Product",
      price: 10.99,
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"category" is required');
  });

  it("should return an error if stock is missing", () => {
    const invalidData = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 1024,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"stock" is required');
  });

  it("should return an error if image is missing required fields", () => {
    const invalidData = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
      },
    };

    const { error } = createProductDto.validate(invalidData, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"image.mimetype" is required');
    expect(error?.details[1].message).toContain('"image.size" is required');
  });

  it("should return an error if image size exceeds 2 MB", () => {
    const invalidData = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 3000000,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      "image size must be less than or equal to 2 MB"
    );
  });

  it("should return an error if image mimetype is invalid", () => {
    const invalidData = {
      name: "Test Product",
      price: 10.99,
      category: "Test Category",
      description: "Test Description",
      stock: 100,
      image: {
        originalname: "image.bmp",
        mimetype: "image/bmp",
        size: 1024,
      },
    };

    const { error } = createProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"image.mimetype" must be one of [image/jpeg, image/png]'
    );
  });
});

describe("updateProductDto Schema", () => {
  it("should validate a valid update product request", () => {
    const validData = {
      name: "Updated Product",
    };

    const { error, value } = updateProductDto.validate(validData);

    expect(error).toBeUndefined();
    expect(value).toEqual(validData);
  });

  it("should return an error if no fields are provided", () => {
    const invalidData = {};

    const { error } = updateProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"value" must contain at least one of [name, price, category, description, stock, image]'
    );
  });

  it("should validate if at least one field is provided", () => {
    const validData = {
      price: 20.99,
    };

    const { error, value } = updateProductDto.validate(validData);

    expect(error).toBeUndefined();
    expect(value).toEqual(validData);
  });

  it("should return an error if image fields are invalid", () => {
    const invalidData = {
      image: {
        originalname: "image.jpg",
      },
    };

    const { error } = updateProductDto.validate(invalidData, {
      abortEarly: false,
    });

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"image.mimetype" is required');
    expect(error?.details[1].message).toContain('"image.size" is required');
  });

  it("should return an error if image size exceeds 2 MB", () => {
    const invalidData = {
      image: {
        originalname: "image.jpg",
        mimetype: "image/jpeg",
        size: 3000000,
      },
    };

    const { error } = updateProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      "image size must be less than or equal to 2 MB"
    );
  });

  it("should return an error if image mimetype is invalid", () => {
    const invalidData = {
      image: {
        originalname: "image.bmp",
        mimetype: "image/bmp",
        size: 1024,
      },
    };

    const { error } = updateProductDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain(
      '"image.mimetype" must be one of [image/jpeg, image/png]'
    );
  });
});
