// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import User from "./src/models/User.js";

// dotenv.config();

// const seed = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   // Clear existing users
//   await User.deleteMany({
//     email: { $in: ["admin@haett.com", "user@haett.com"] },
//   });

//   const salt = await bcrypt.genSalt(10);

//   await User.create([
//     {
//       name: "Admin",
//       email: "admin@haett.com",
//       password: await bcrypt.hash("admin123", salt),
//       role: "admin",
//     },
//     {
//       name: "Test User",
//       email: "user@haett.com",
//       password: await bcrypt.hash("user123", salt),
//       role: "user",
//     },
//   ]);

//   console.log("Seeded: admin@haett.com / admin123");
//   console.log("Seeded: user@haett.com / user123");

//   process.exit(0);
// };

// seed().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({
    email: { $in: ["admin@haett.com", "user@haett.com"] },
  });

  // Don't manually hash — the User model pre("save") hook handles it
  await User.create([
    {
      name: "Admin",
      email: "admin@haett.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Test User",
      email: "user@haett.com",
      password: "user123",
      role: "user",
    },
  ]);

  console.log("Seeded: admin@haett.com / admin123");
  console.log("Seeded: user@haett.com / user123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});