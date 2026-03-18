import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { env } from "../config/env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI SHIKSHAK API",
      version: "1.0.0",
    },

    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
      },
      {
        url: "https://ai-shikshak.onrender.com/api",
      },
    ],
  },

  apis: [
    path.resolve("./src/modules/**/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };