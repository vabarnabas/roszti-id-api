import express, { Express } from "express";
import cors from "cors";
import userRouter from "./src/routes/users";
import authenticationRouter from "./src/routes/authentication";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(authenticationRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
