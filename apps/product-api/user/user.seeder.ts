import connectDB from "../shared/config/db.config";
import User from "../../models/user.model";
import bcrypt from "bcrypt";

const users = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "user1@gmail.com",
    password: "password",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "user2@gmail.com",
    password: "password",
  },
];

const seedUsers = async () => {
  const salt = await bcrypt.genSalt(10);

  await connectDB();

  await User.deleteMany({});
  await User.insertMany(
    users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt),
    }))
  );
};

seedUsers()
  .then(() => {
    console.log("Users seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Users seeding admin:", err);
    process.exit(1);
  });
