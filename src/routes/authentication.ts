import { compare } from "bcrypt";
import { Request, Response, Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const authenticationRouter = Router();

//Authenticate User
authenticationRouter.post("/login", async (req: Request, res: Response) => {
  const userData: {
    email: string;
    password: string;
  } = req.body;

  if (!userData) {
    res.send(400).json({ error: "Missing argument from body." });
  }

  const user = await prisma.user.findMany({
    where: { email: userData.email },
  });

  if (user && (await compare(userData.password, user[0].password))) {
    jwt.sign(
      { id: user[0].id },
      "ESTIEM2022",
      { algorithm: "HS256", expiresIn: "2h" },
      function (err, token) {
        res.json({ data: { token } });
      }
    );
  } else {
    res
      .status(401)
      .json({ error: "Invalid login credentials or missing user." });
  }
});

authenticationRouter.post(
  "/current",
  verifyToken,
  async (req: Request, res: Response) => {
    const { decoded } = req.body;
    if (!decoded.id) {
      res.status(401);
    }
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    res.json({ data: user });
  }
);

export default authenticationRouter;
