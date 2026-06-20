import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#routes/users";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

export default app;
