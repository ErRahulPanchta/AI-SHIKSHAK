import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import dns from "dns";
import User from "../src/modules/user/user.model.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});
