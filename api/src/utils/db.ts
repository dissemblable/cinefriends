import { PrismaClient } from "@/generated/prisma/client.js"

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

process.on("beforeExit", async () => {
  await prisma.$disconnect()
})
