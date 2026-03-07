import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});