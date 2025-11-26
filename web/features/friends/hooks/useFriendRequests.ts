import { useQuery } from "@tanstack/react-query"
import { friendsApi } from "@/lib/api/friends"

export function usePendingFriendRequests() {
  return useQuery({
    queryKey: ["friends", "pending"],
    queryFn: friendsApi.getPendingRequests,
  })
}

export function useFriendRequestsCount() {
  const { data: requests = [] } = usePendingFriendRequests()
  return requests.length
}
