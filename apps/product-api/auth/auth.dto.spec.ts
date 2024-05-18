import { loginDto } from "./auth.dto";

describe("loginDto Schema", () => {
  it("should validate a valid email and password", () => {
    const validData = {
      email: "testuser@example.com",
      password: "Password123",
    };

    const { error, value } = loginDto.validate(validData);

    expect(error).toBeUndefined();
    expect(value).toEqual(validData);
  });

  it("should return an error if email is missing", () => {
    const invalidData = {
      password: "Password123",
    };

    const { error } = loginDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"email" is required');
  });

  it("should return an error if password is missing", () => {
    const invalidData = {
      email: "testuser@example.com",
    };

    const { error } = loginDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"password" is required');
  });

  it("should return an error if email is not a string", () => {
    const invalidData = {
      email: 12345,
      password: "Password123",
    };

    const { error } = loginDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"email" must be a string');
  });

  it("should return an error if password is not a string", () => {
    const invalidData = {
      email: "testuser@example.com",
      password: 12345,
    };

    const { error } = loginDto.validate(invalidData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('"password" must be a string');
  });
});
