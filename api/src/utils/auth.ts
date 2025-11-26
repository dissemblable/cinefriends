import env from "@/env.js";
import { PrismaClient } from "@/generated/prisma/client.js";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins: [env.FRONTEND_URL],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
