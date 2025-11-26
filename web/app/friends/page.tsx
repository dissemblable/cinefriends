"use client"

import Container from "@/components/Container"
import Page from "@/components/Page"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FriendsTab } from "@/features/friends/components/FriendsTab"
import { PendingRequestsTab } from "@/features/friends/components/PendingRequestsTab"
import { SearchUsersTab } from "@/features/friends/components/SearchUsersTab"
import { SentRequestsTab } from "@/features/friends/components/SentRequestsTab"
import type { FriendWithInfo, Friendship, User } from "@/lib/api/friends"
import { friendsApi } from "@/lib/api/friends"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const queryClient = useQueryClient()

  const { data: friends = [], isLoading: loadingFriends } = useQuery<
    FriendWithInfo[]
  >({
    queryKey: ["friends"],
    queryFn: friendsApi.getFriends,
  })

  const { data: pendingRequests = [], isLoading: loadingPending } = useQuery<
    Friendship[]
  >({
    queryKey: ["friends", "pending"],
    queryFn: friendsApi.getPendingRequests,
  })

  const { data: sentRequests = [], isLoading: loadingSent } = useQuery<
    Friendship[]
  >({
    queryKey: ["friends", "sent"],
    queryFn: friendsApi.getSentRequests,
  })

  const { data: searchResults = [], isFetching: searchingUsers } = useQuery<
    User[]
  >({
    queryKey: ["users", "search", debouncedSearchQuery],
    queryFn: () => friendsApi.searchUsers(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2,
  })

  const sendRequestMutation = useMutation({
    mutationFn: friendsApi.sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
      queryClient.invalidateQueries({ queryKey: ["users", "search"] })
    },
  })

  const acceptRequestMutation = useMutation({
    mutationFn: friendsApi.acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const rejectRequestMutation = useMutation({
    mutationFn: friendsApi.rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const removeFriendMutation = useMutation({
    mutationFn: friendsApi.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <Page>
      <Container>
        <Tabs defaultValue="friends">
          <div className="pt-8 pb-6 flex items-start md:items-end justify-between flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-bold mb-2">Friends</h1>
              <p className="text-muted-foreground">
                Manage your friends and friend requests
              </p>
            </div>

            <TabsList className="w-fit md:ml-auto mt-3">
              <TabsTrigger value="friends">
                Friends {friends.length > 0 && `(${friends.length})`}
              </TabsTrigger>
              <TabsTrigger value="pending">
                Requests{" "}
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent">
                Sent {sentRequests.length > 0 && `(${sentRequests.length})`}
              </TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="friends" className="space-y-4">
            <FriendsTab
              friends={friends}
              isLoading={loadingFriends}
              removeFriendMutation={removeFriendMutation}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <PendingRequestsTab
              pendingRequests={pendingRequests}
              isLoading={loadingPending}
              acceptRequestMutation={acceptRequestMutation}
              rejectRequestMutation={rejectRequestMutation}
            />
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            <SentRequestsTab
              sentRequests={sentRequests}
              isLoading={loadingSent}
            />
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <SearchUsersTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchResults={searchResults}
              isSearching={searchingUsers}
              sendRequestMutation={sendRequestMutation}
            />
          </TabsContent>
        </Tabs>
      </Container>
    </Page>
  )
}
