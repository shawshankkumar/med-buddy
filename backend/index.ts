import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./src/lib/logger";
import { healthcheckService } from "./src/api/healthcheck";
import { loginService, signupService } from "./src/api/auth";
import { filesService, uploadService } from "./src/api/files";
import { summaryService } from "./src/api/genai";
import { ulid } from "ulid";
import { Request, Response, NextFunction } from "express";

const port = process.env.PORT ?? 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(helmet());

//set req id
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.requestId = "req_" + ulid();
  next();
});

app.post("/upload", uploadService);

app.get("/files", filesService);

app.post("/summary", summaryService);

app.post("/register", signupService);

app.post("/login", loginService);

app.get("/", healthcheckService);

app.listen(port, () => {
  logger.info(`MED BUDDY app listening on port ${port}`);
});
