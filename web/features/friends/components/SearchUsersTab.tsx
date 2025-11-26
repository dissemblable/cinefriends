"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { UseMutationResult } from "@tanstack/react-query"
import type { User } from "@/lib/api/friends"

interface SearchUsersTabProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchResults: User[]
  isSearching: boolean
  sendRequestMutation: UseMutationResult<any, Error, string>
}

export function SearchUsersTab({
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  sendRequestMutation,
}: SearchUsersTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {searchQuery.length < 2 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Type at least 2 characters to search
          </CardContent>
        </Card>
      ) : isSearching ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : searchResults.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No users found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-green-500/50"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-lg mb-3">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/users/${user.id}`}
                    className="font-semibold hover:text-primary hover:underline transition-colors line-clamp-1"
                  >
                    {user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {user.email}
                  </p>
                  {user.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {user.bio}
                    </p>
                  )}
                  <Button
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => sendRequestMutation.mutate(user.id)}
                    disabled={sendRequestMutation.isPending}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {sendRequestMutation.isPending ? "Adding..." : "Add Friend"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
