import { CONFIG } from "./config";
import pino from "pino";

const options: { transport?: { target: string } } = {};

if (CONFIG.ENV === "dev")
  options.transport = {
    target: CONFIG.ENV ? "pino-pretty" : "",
  };

export const logger = pino(options);
