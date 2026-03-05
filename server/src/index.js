import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();