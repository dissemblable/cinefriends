"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Loader2, X } from "lucide-react"
import { UseMutationResult } from "@tanstack/react-query"
import type { Friendship } from "@/lib/api/friends"

interface PendingRequestsTabProps {
  pendingRequests: Friendship[]
  isLoading: boolean
  acceptRequestMutation: UseMutationResult<any, Error, string>
  rejectRequestMutation: UseMutationResult<any, Error, string>
}

export function PendingRequestsTab({
  pendingRequests,
  isLoading,
  acceptRequestMutation,
  rejectRequestMutation,
}: PendingRequestsTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pending friend requests
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pendingRequests.map((request) => (
        <Card
          key={request.id}
          className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-blue-500/50"
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg mb-3">
                <AvatarImage src={request.sender?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {request.sender?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold line-clamp-1">
                {request.sender?.name}
              </div>
              {request.sender?.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {request.sender.bio}
                </p>
              )}
              <div className="flex gap-2 mt-4 w-full">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => acceptRequestMutation.mutate(request.id)}
                  disabled={acceptRequestMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {acceptRequestMutation.isPending ? "..." : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => rejectRequestMutation.mutate(request.id)}
                  disabled={rejectRequestMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  {rejectRequestMutation.isPending ? "..." : "Decline"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
