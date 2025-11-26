import type { Context } from "hono"
import { StatusCodes } from "http-status-codes"

export const errorHandler = (err: Error, c: Context) => {
  console.error("Error:", err)

  return c.json(
    {
      success: false,
      message: err.message || "Error occurred",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    StatusCodes.INTERNAL_SERVER_ERROR
  )
}
