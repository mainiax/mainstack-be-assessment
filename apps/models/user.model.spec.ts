import mongoose from "mongoose";
import User from "./user.model";
import bcrypt from "bcrypt";

const testUser = {
  firstName: "Test",
  lastName: "User",
  email: "testuser@example.com",
  password: "Password123",
};

const setupDatabase = async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    dbName: "user-db-test",
  });
  await User.deleteMany({});
};

const teardownDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};

describe("User Model", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it("should create and save a user successfully", async () => {
    const userData = { ...testUser };
    const user = new User(userData);
    user.password = bcrypt.hashSync(user.password, 10);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe(testUser.firstName);
    expect(savedUser.lastName).toBe(testUser.lastName);
    expect(savedUser.email).toBe(testUser.email);
    expect(bcrypt.compareSync(testUser.password, savedUser.password)).toBe(
      true
    );
  });

  it("should not save a user without a required field", async () => {
    const userData = {
      lastName: testUser.lastName,
      email: testUser.email,
      password: testUser.password,
    };

    const user = new User(userData);

    let err: any;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.firstName).toBeDefined();
  });

  it("should compare passwords correctly", async () => {
    const userData = { ...testUser };
    const user = new User(userData);
    user.password = bcrypt.hashSync(user.password, 10);
    await user.save();

    const isMatch = user.comparePassword(testUser.password);
    expect(isMatch).toBe(true);
  });

  it("should soft delete a user", async () => {
    const user = new User(testUser);
    user.password = bcrypt.hashSync(user.password, 10);
    await user.save();

    await user.delete();

    const foundUser = await User.findOne({ _id: user._id });

    expect(foundUser).toBeNull();

    const deletedUser = await User.findOneDeleted({ _id: user._id });

    expect(deletedUser).not.toBeNull();
    expect(deletedUser?.deleted).toBe(true);
  });

  it("should correctly transform the JSON representation", async () => {
    const userData = {
      ...testUser,
      password: bcrypt.hashSync(testUser.password, 10),
    };
    const user = new User(userData);
    const savedUser = await user.save();
    const jsonUser = savedUser.toJSON();

    expect(jsonUser._id).toBeDefined();
    expect(jsonUser.firstName).toBe(testUser.firstName);
    expect(jsonUser.lastName).toBe(testUser.lastName);
    expect(jsonUser.email).toBe(testUser.email);

    expect(jsonUser.password).toBeUndefined();
    expect(jsonUser.deleted).toBeUndefined();
    expect(jsonUser.deletedAt).toBeUndefined();
    expect(jsonUser.__v).toBeUndefined();
  });
});
