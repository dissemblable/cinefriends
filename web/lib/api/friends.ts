const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface User {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
}

export interface Friendship {
  id: string
  senderId: string
  receiverId: string
  status: string
  createdAt: string
  updatedAt: string
  sender?: User
  receiver?: User
}

export interface FriendWithInfo {
  friendshipId: string
  friend: User
}

export interface FriendshipStatus {
  status: "none" | "pending" | "accepted" | "rejected"
  friendshipId: string | null
  isSender?: boolean
}

export const friendsApi = {
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await fetch(
      `${API_URL}/api/friends/search?q=${encodeURIComponent(query)}`,
      {
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to search users")
    }

    const data = await response.json()
    return data.data
  },

  sendFriendRequest: async (receiverId: string): Promise<Friendship> => {
    const response = await fetch(`${API_URL}/api/friends/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ receiverId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send friend request")
    }

    const data = await response.json()
    return data.data
  },

  acceptFriendRequest: async (friendshipId: string): Promise<Friendship> => {
    const response = await fetch(
      `${API_URL}/api/friends/requests/${friendshipId}/accept`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to accept friend request")
    }

    const data = await response.json()
    return data.data
  },

  rejectFriendRequest: async (friendshipId: string): Promise<Friendship> => {
    const response = await fetch(
      `${API_URL}/api/friends/requests/${friendshipId}/reject`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to reject friend request")
    }

    const data = await response.json()
    return data.data
  },

  removeFriend: async (friendshipId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/api/friends/${friendshipId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to remove friend")
    }

    const data = await response.json()
    return data.data
  },

  getFriends: async (): Promise<FriendWithInfo[]> => {
    const response = await fetch(`${API_URL}/api/friends`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to get friends")
    }

    const data = await response.json()
    return data.data
  },

  getPendingRequests: async (): Promise<Friendship[]> => {
    const response = await fetch(`${API_URL}/api/friends/requests/pending`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to get pending requests")
    }

    const data = await response.json()
    return data.data
  },

  getSentRequests: async (): Promise<Friendship[]> => {
    const response = await fetch(`${API_URL}/api/friends/requests/sent`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to get sent requests")
    }

    const data = await response.json()
    return data.data
  },

  getFriendshipStatus: async (userId: string): Promise<FriendshipStatus> => {
    const response = await fetch(`${API_URL}/api/friends/status/${userId}`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to get friendship status")
    }

    const data = await response.json()
    return data.data
  },
}
