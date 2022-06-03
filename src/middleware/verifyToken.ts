import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearerToken = bearerHeader.slice(7);
    jwt.verify(bearerToken, "ESTIEM2022", (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Unathorized or expired token." });
      } else if (decoded) {
        req.body = { ...req.body, decoded };
        next();
      }
    });
  } else {
    res.status(401).json({ error: "Missing argument Authorization Header." });
  }
};
