
/** @type { import("drizzle-kit").Config } */
import { dbURL } from "./constants";


export default {
  schema: "./lib/db/schema.js",
  out: "./lib/db/migrations",
  driver:"better-sqlite",
  dbCredentials:{
    url:dbURL
  }
};