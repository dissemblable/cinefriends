import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    FRONTEND_URL: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
});

export default env;
