import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV
} = process.env;

// Safety check
if (NODE_ENV === "production") {
  console.error("DB reset is disabled in production");
  process.exit(1);
}

const schemaPath = path.join(__dirname, "../db/schema.sql");

function run(command) {
  execSync(command, {
    stdio: "inherit",
    env: {
      ...process.env,
      PGPASSWORD: DB_PASSWORD
    }
  });
}

try {
  console.log("Dropping database...");
  run(`dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}`);

  console.log("Creating database...");
  run(`createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}`);

  console.log("Loading schema...");
  run(
    `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${schemaPath}`
  );

  console.log("Database reset complete");
} catch (error) {
  console.error("DB reset failed");
  process.exit(1);
}
