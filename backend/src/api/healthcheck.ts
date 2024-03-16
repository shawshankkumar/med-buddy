import { Request, Response } from "express";
import { logger } from "../lib/logger";

export function healthcheckService(req: Request, res: Response) {
  const resBody = {
    uptime: process.uptime(),
    timestamp: +new Date(),
    message: "Med Buddy healthcheck successfull!",
  };
  logger.info(resBody);
  res.status(200).json(resBody);
}
