import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI SHIKSHAK API",
      version: "1.0.0",
      description:
        "Production-ready API documentation for AI SHIKSHAK blogging platform",
    },

    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: "Local Development Server",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "User", description: "User management APIs" },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },

        // Optional (if you ever switch to Bearer)
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        cookieAuth: [],
      },
    ],
  },

  // IMPORTANT: match your actual structure
  apis: [
    "./src/modules/**/*.js", // controllers + routes
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };