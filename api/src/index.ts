import { authMiddleware } from "@/middlewares/auth.middleware.js"
import { errorHandler } from "@/middlewares/error.middleware.js"
import routes from "@/routes/index.js"
import type { HonoContext } from "@/types/hono.js"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import env from "./env.js"

const app = new Hono<HonoContext>()

app.use(
  cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
  })
)

app.use("*", authMiddleware)
app.use("*", logger())

app.get("/", async (c) => {
  const session = c.get("user")

  return c.text(`Welcome ${session ? session.name : "Guest"}!`)
})

app.route("/api", routes)

app.onError(errorHandler)

console.log(`Server running on http://localhost:3001`)

serve({
  fetch: app.fetch,
  port: 3001,
})

export default app
