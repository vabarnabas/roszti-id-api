import { genSalt, hash } from "bcrypt";
import { Request, Response, Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const userRouter = Router();

//Get Users
userRouter.get("/users", verifyToken, async (req: Request, res: Response) => {
  const users: User[] = await prisma.user.findMany();
  res.send({ data: users });
});

userRouter.get(
  "/users/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      res.send({ data: user });
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
);

//Create User
userRouter.post(
  "/users/create",
  verifyToken,
  async (req: Request, res: Response) => {
    const { data }: { data: User } = req.body;

    if (!data) {
      res.status(400).json({ error: "Missing argument: Data." });
    }

    try {
      const salt = await genSalt();
      const newUser = await prisma.user.create({
        data: { ...data, password: await hash(data.password, salt) },
      });
      res.send({ data: newUser });
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
);

//Update User
userRouter.put(
  "/users/update/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
      res.status(400).json({ error: "Missing argument: Data." });
    }

    if (data?.password) {
      const salt = await genSalt();
      data.password = await hash(data.password, salt);
    }
    try {
      const updateUser = await prisma.user.update({
        where: { id },
        data: { ...data },
      });
      res.send({ data: updateUser });
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
);

//Delete User
userRouter.delete(
  "/users/delete/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deleteUser = await prisma.user.delete({
        where: { id },
      });
      res.json({ data: deleteUser });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

export default userRouter;
