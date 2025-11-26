"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, UserX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UseMutationResult } from "@tanstack/react-query"
import type { FriendWithInfo } from "@/lib/api/friends"

interface FriendsTabProps {
  friends: FriendWithInfo[]
  isLoading: boolean
  removeFriendMutation: UseMutationResult<any, Error, string>
}

export function FriendsTab({
  friends,
  isLoading,
  removeFriendMutation,
}: FriendsTabProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          You don't have any friends yet. Search for users to add friends!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {friends.map(({ friendshipId, friend }) => (
        <Card
          key={friendshipId}
          className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/50 cursor-pointer"
          onClick={() => router.push(`/users/${friend.id}`)}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg mb-3">
                <AvatarImage src={friend.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {friend.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold line-clamp-1">
                {friend.name}
              </div>
              {friend.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {friend.bio}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFriendMutation.mutate(friendshipId)
                }}
                disabled={removeFriendMutation.isPending}
              >
                <UserX className="h-4 w-4 mr-1" />
                {removeFriendMutation.isPending ? "Removing..." : "Remove"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
