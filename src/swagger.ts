import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TweetAI API",
      version: "1.0.0",
      description: "API documentation for TweetAI, including endpoints for managing Autobots, posts, and comments.",
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
              description: "Unique identifier for the Autobot.",
            },
            name: {
              type: "string",
              description: "Name of the Autobot.",
            },
            posts: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
              description: "List of posts associated with the Autobot.",
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the Post.",
            },
            title: {
              type: "string",
              description: "Title of the Post.",
            },
            body: {
              type: "string",
              description: "Body content of the Post.",
            },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
              description: "List of comments associated with the Post.",
            },
            autobot: {
              $ref: "#/components/schemas/Autobot",
              description: "The Autobot that created this post.",
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the Comment.",
            },
            text: {
              type: "string",
              description: "Content of the Comment.",
            },
            post: {
              $ref: "#/components/schemas/Post",
              description: "The Post to which this comment belongs.",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts"], // Path to your API documentation
};

const swaggerDocs = (app: Express) => {
  const specs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerDocs;
