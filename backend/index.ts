import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./src/lib/logger";
import { healthcheckService } from "./src/api/healthcheck";
import { loginService, signupService } from "./src/api/auth";
import { filesService, getChatAllService, shareService, sharedFilesService, uploadService } from "./src/api/files";
import { getChatService, summaryService } from "./src/api/genai";
import { ulid } from "ulid";
import { Request, Response, NextFunction } from "express";
import { upload } from "./src/lib/storage";

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

app.post("/upload", upload.single("file"), uploadService);

app.post("/files", filesService);

app.post("/summary", summaryService);

app.post("/register", signupService);

app.post("/login", loginService);

app.post("/share", shareService);

app.post("/chat", getChatService);

app.get("/files-shared", sharedFilesService);

app.post("/chat-all", getChatAllService)

app.get("/", healthcheckService);

app.listen(port, () => {
  logger.info(`MED BUDDY app listening on port ${port}`);
});
