import http from "node:http";
import { createApp } from "./app.js";
import { assertDatabaseConnection } from "./db/db.js";
import { logger } from "./lib/logger.js";
import { env } from "./config/env.js";

async function bootstrap() {
  try {
    await assertDatabaseConnection();

    const app = createApp();
    const server = http.createServer(app);
    const port = Number(env.PORT) || 5000;

    server.listen(port, () => {
      logger.info(`Server is now running on port ${port} `);
    });
  } catch (error) {
    logger.error(`Failed to start the server`, ` ${(error as Error).message}`);
    process.exit(1);
  }
}

bootstrap();
