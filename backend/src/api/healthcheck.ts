import { Request, Response } from "express";
import { logger } from "../lib/logger";

export function healthcheckService(req: Request, res: Response) {
  const resBody = {
    uptime: process.uptime(),
    timestamp: +new Date(),
    message: "Medofile - Cloud integrated AI : medical report analysis healthcheck successful!",
    requestId: res.locals.requestId
  };
  logger.info(resBody);
  res.status(200).json(resBody);
}
