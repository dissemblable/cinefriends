"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Friendship } from "@/lib/api/friends"

interface SentRequestsTabProps {
  sentRequests: Friendship[]
  isLoading: boolean
}

export function SentRequestsTab({
  sentRequests,
  isLoading,
}: SentRequestsTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (sentRequests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No sent friend requests
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sentRequests.map((request) => (
        <Card
          key={request.id}
          className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-amber-500/50"
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg mb-3">
                <AvatarImage src={request.receiver?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {request.receiver?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold line-clamp-1">
                {request.receiver?.name}
              </div>
              {request.receiver?.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {request.receiver.bio}
                </p>
              )}
              <Badge variant="secondary" className="mt-4">
                ⏳ Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
