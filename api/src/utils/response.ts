import { type Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import { StatusCodes } from "http-status-codes"

export const successResponse = (
  c: Context,
  data: any,
  status = StatusCodes.OK
) => {
  return c.json(
    {
      success: true,
      data,
    },
    status as ContentfulStatusCode
  )
}

export const errorResponse = (
  c: Context,
  message: string,
  status = StatusCodes.BAD_REQUEST
) => {
  return c.json(
    {
      success: false,
      message,
    },
    status as ContentfulStatusCode
  )
}
