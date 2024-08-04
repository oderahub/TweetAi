import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TweetAI API",
      version: "1.0.0",
      description: "API documentation for TweetAI",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Autobot: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "UUID of the Autobot",
            },
            name: {
              type: "string",
              description: "Name of the Autobot",
            },
            posts: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "UUID of the Post",
            },
            title: {
              type: "string",
              description: "Title of the Post",
            },
            body: {
              type: "string",
              description: "Body of the Post",
            },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
            autobot: {
              $ref: "#/components/schemas/Autobot",
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "UUID of the Comment",
            },
            text: {
              type: "string",
              description: "Text of the Comment",
            },
            post: {
              $ref: "#/components/schemas/Post",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts"],
};

const swaggerDocs = (app: Express) => {
  const specs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerDocs;
