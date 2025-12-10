import path from "node:path";
import { logger } from "../lib/logger.js";
import fs from "node:fs";
import { query } from "./db.js";

const migrationsDir = path.resolve(process.cwd(), "src", "migrations");

async function runMigrations() {
  logger.info(`Looking for migrations in ${migrationsDir}`);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    logger.info("no migrations found!");
    return;
  }

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    logger.info(`Running migrations`);

    await query(sql);

    logger.info(`finished migrations`);
  }
}

runMigrations()
  .then(() => {
    logger.info("All migration run successfully");
    process.exit(0);
  })
  .catch((err) => {
    logger.error(`Migration failed ${(err as Error).message}`);
    process.exit(1);
  });
