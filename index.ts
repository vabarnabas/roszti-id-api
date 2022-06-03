import express, { Express, Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const app: Express = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient();

//Get Users
app.get("/users", async (req: Request, res: Response) => {
  const users: User[] = await prisma.user.findMany();
  res.send(users);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Create User
app.post("/users/create", async (req: Request, res: Response) => {
  const data: User = req.body;

  try {
    const salt = await genSalt();
    const newUser = await prisma.user.create({
      data: { ...data, password: await hash(data.password, salt) },
    });
    res.send(newUser);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Update User
app.put("/users/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (data?.password) {
    const salt = await genSalt();
    data.password = await hash(data.password, salt);
  }

  try {
    const deleteUser = await prisma.user.update({
      where: { id },
      data: { ...data },
    });
    res.send(deleteUser);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Delete User
app.delete("/users/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleteUser = await prisma.user.delete({
      where: { id },
    });
    res.json(deleteUser);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//Authenticate User
app.post("/login", async (req: Request, res: Response) => {
  const userData: {
    id: string;
    password: string;
  } = req.body;

  if (!userData) {
    res.send(400).json({ error: "Missing argument from body." });
  }

  const user = await prisma.user.findUnique({ where: { id: userData.id } });

  if (user && (await compare(userData.password, user.password))) {
    jwt.sign(
      { user },
      "ssssssss",
      { algorithm: "HS256" },
      function (err, token) {
        console.log(token);
        res.json({ token });
      }
    );
  } else {
    res
      .status(401)
      .json({ error: "Invalid login credentials or missing user." });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
