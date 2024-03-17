import { Db, MongoClient } from "mongodb";
import { CONFIG } from "./config";
let db: Db;

async function initializeClient() {
  const client = await MongoClient.connect(CONFIG.DB_URI);

  return client.db();
}

export async function getDb() {
  if (!db) {
    // @ts-ignore
    db = await initializeClient();
  }
  return db;
}
