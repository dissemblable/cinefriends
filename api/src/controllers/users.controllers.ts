import * as usersService from "@/services/users.service.js"
import { errorResponse, successResponse } from "@/utils/response.js"
import type { Context } from "hono"
import { StatusCodes } from "http-status-codes"

export const getUserById = async (c: Context) => {
  const id = c.req.param("id")
  const user = await usersService.getUserById(id)

  if (!user) {
    return errorResponse(c, "User not found", StatusCodes.NOT_FOUND)
  }

  return successResponse(c, user)
}

export const updateUser = async (c: Context) => {
  const id = c.req.param("id")
  const session = c.get("session")
  const currentUser = c.get("user")

  // Vérifier que l'utilisateur est connecté
  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  // Vérifier que l'utilisateur modifie son propre profil
  if (currentUser.id !== id) {
    return errorResponse(c, "Forbidden: You can only update your own profile", StatusCodes.FORBIDDEN)
  }

  const data = await c.req.json()
  const user = await usersService.updateUser(id, data)

  return successResponse(c, user)
}
