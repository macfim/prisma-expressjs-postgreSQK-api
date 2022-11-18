import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/posts/", async (request: Request, response: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
    });

    response.json(posts);
  } catch (err: unknown) {
    response.status(400).send();
  }
});

app.post("/posts", async (request: Request, response: Response) => {
  try {
    const { title, description, authorId } = request.body;

    if (!title || !authorId) return response.status(400).send();

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    response.json(newPost);
  } catch (err: unknown) {
    response.status(400).send();
  }
});

app.get("/users", async (request: Request, response: Response) => {
  try {
    const users = await prisma.user.findMany();

    response.json(users);
  } catch (err: unknown) {
    response.status(400).send();
  }
});

app.post("/users", async (request: Request, response: Response) => {
  try {
    const { username, name } = request.body;

    if (!username) return response.status(400).send();

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
      },
    });

    response.json(newUser);
  } catch (err: unknown) {
    response.status(400).send();
  }
});

export default app;
