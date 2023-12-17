import express from "express";
import userRouter from "./routes/usersRoute.js";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const app = express();

const swaggerDocument = YAML.load("openapi.spec.yaml");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://apiproject-frontend-main.vercel.app/",
    "http://localhost:3001",
    "http://localhost:3002",
  ], //Your Client, do not write '*'
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(
  session({
    secret: "Keep it secret",
    name: "uniqueSessionID",
    saveUninitialized: false,
    resave: false, // Avoids session save on every request
    rolling: true, // Reset the session timer on every request
  })
);

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postsRouter);

const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
