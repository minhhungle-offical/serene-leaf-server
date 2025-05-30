import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import YAML from "yamljs";

const isProd = process.env.NODE_ENV === "production";

// Load swagger files
const authSpec = YAML.load(path.join(process.cwd(), "docs", "auth.yaml"));
const userSpec = YAML.load(path.join(process.cwd(), "docs", "user.yaml"));

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Serene Leaf API",
      version: "1.0.0",
      description: "API documentation for the Tea Shop backend",
    },
    paths: {
      ...authSpec.paths,
      ...userSpec.paths,
    },
    components: {
      ...authSpec.components,
      ...userSpec.components,
    },
    servers: [
      {
        url: isProd
          ? "https://api.teashop.com" // replace with your production API domain
          : "http://localhost:3000/api",
        description: isProd ? "Production server" : "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // update this if you use `src/`
});

export default swaggerSpec;
