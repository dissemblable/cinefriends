"use client"

import { Button } from "@/components/ui/button"
import { friendsApi } from "@/lib/api/friends"
import type { FriendshipStatus } from "@/lib/api/friends"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, Loader2, UserMinus, UserPlus, X } from "lucide-react"

interface FriendshipButtonProps {
  userId: string
}

export function FriendshipButton({ userId }: FriendshipButtonProps) {
  const queryClient = useQueryClient()

  const { data: status, isLoading } = useQuery<FriendshipStatus>({
    queryKey: ["friendship-status", userId],
    queryFn: () => friendsApi.getFriendshipStatus(userId),
  })

  const sendRequestMutation = useMutation({
    mutationFn: () => friendsApi.sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship-status", userId] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const acceptRequestMutation = useMutation({
    mutationFn: (friendshipId: string) =>
      friendsApi.acceptFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship-status", userId] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const rejectRequestMutation = useMutation({
    mutationFn: (friendshipId: string) =>
      friendsApi.rejectFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship-status", userId] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const removeFriendMutation = useMutation({
    mutationFn: (friendshipId: string) =>
      friendsApi.removeFriend(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship-status", userId] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (!status) {
    return null
  }

  // Aucune relation
  if (status.status === "none") {
    return (
      <Button
        onClick={() => sendRequestMutation.mutate()}
        disabled={sendRequestMutation.isPending}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Friend
      </Button>
    )
  }

  // Demande en attente envoyée par l'utilisateur actuel
  if (status.status === "pending" && status.isSender) {
    return (
      <Button variant="secondary" disabled>
        Request Sent
      </Button>
    )
  }

  // Demande en attente reçue par l'utilisateur actuel
  if (status.status === "pending" && !status.isSender && status.friendshipId) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => acceptRequestMutation.mutate(status.friendshipId!)}
          disabled={acceptRequestMutation.isPending}
        >
          <Check className="h-4 w-4 mr-2" />
          Accept
        </Button>
        <Button
          variant="outline"
          onClick={() => rejectRequestMutation.mutate(status.friendshipId!)}
          disabled={rejectRequestMutation.isPending}
        >
          <X className="h-4 w-4 mr-2" />
          Decline
        </Button>
      </div>
    )
  }

  // Amis
  if (status.status === "accepted" && status.friendshipId) {
    return (
      <Button
        variant="outline"
        onClick={() => removeFriendMutation.mutate(status.friendshipId!)}
        disabled={removeFriendMutation.isPending}
      >
        <UserMinus className="h-4 w-4 mr-2" />
        Remove Friend
      </Button>
    )
  }

  return null
}
