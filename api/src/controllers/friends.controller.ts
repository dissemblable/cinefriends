import * as friendsService from "@/services/friends.service.js"
import { errorResponse, successResponse } from "@/utils/response.js"
import type { Context } from "hono"
import { StatusCodes } from "http-status-codes"

export const searchUsers = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const query = c.req.query("q")

  if (!query || query.trim().length < 2) {
    return errorResponse(
      c,
      "Search query must be at least 2 characters",
      StatusCodes.BAD_REQUEST
    )
  }

  const users = await friendsService.searchUsers(query, currentUser.id)
  return successResponse(c, users)
}

export const sendFriendRequest = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const { receiverId } = await c.req.json()

  if (!receiverId) {
    return errorResponse(c, "Receiver ID is required", StatusCodes.BAD_REQUEST)
  }

  if (receiverId === currentUser.id) {
    return errorResponse(
      c,
      "You cannot send a friend request to yourself",
      StatusCodes.BAD_REQUEST
    )
  }

  try {
    const friendship = await friendsService.sendFriendRequest(
      currentUser.id,
      receiverId
    )
    return successResponse(c, friendship, StatusCodes.CREATED)
  } catch (error) {
    return errorResponse(
      c,
      error instanceof Error ? error.message : "Failed to send friend request",
      StatusCodes.BAD_REQUEST
    )
  }
}

export const acceptFriendRequest = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const friendshipId = c.req.param("id")

  try {
    const friendship = await friendsService.acceptFriendRequest(
      friendshipId,
      currentUser.id
    )
    return successResponse(c, friendship)
  } catch (error) {
    return errorResponse(
      c,
      error instanceof Error ? error.message : "Failed to accept friend request",
      StatusCodes.BAD_REQUEST
    )
  }
}

export const rejectFriendRequest = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const friendshipId = c.req.param("id")

  try {
    const friendship = await friendsService.rejectFriendRequest(
      friendshipId,
      currentUser.id
    )
    return successResponse(c, friendship)
  } catch (error) {
    return errorResponse(
      c,
      error instanceof Error ? error.message : "Failed to reject friend request",
      StatusCodes.BAD_REQUEST
    )
  }
}

export const removeFriend = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const friendshipId = c.req.param("id")

  try {
    const result = await friendsService.removeFriend(friendshipId, currentUser.id)
    return successResponse(c, result)
  } catch (error) {
    return errorResponse(
      c,
      error instanceof Error ? error.message : "Failed to remove friend",
      StatusCodes.BAD_REQUEST
    )
  }
}

export const getFriends = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const friends = await friendsService.getFriends(currentUser.id)
  return successResponse(c, friends)
}

export const getPendingRequests = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const requests = await friendsService.getPendingRequests(currentUser.id)
  return successResponse(c, requests)
}

export const getSentRequests = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const requests = await friendsService.getSentRequests(currentUser.id)
  return successResponse(c, requests)
}

export const getFriendshipStatus = async (c: Context) => {
  const session = c.get("session")
  const currentUser = c.get("user")

  if (!session || !currentUser) {
    return errorResponse(c, "Unauthorized", StatusCodes.UNAUTHORIZED)
  }

  const userId = c.req.param("userId")

  const status = await friendsService.getFriendshipStatus(currentUser.id, userId)
  return successResponse(c, status)
}
