"use client"

import Container from "@/components/Container"
import Page from "@/components/Page"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicProfileView } from "@/features/profile"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:5000"

interface UserProfile {
  id: string
  email: string
  name: string
  image: string | null
  bio: string | null
  createdAt: string
  emailVerified: boolean
}

async function fetchUser(userId: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }

  const data = await response.json()

  // Handle successResponse format { success: true, data: {...} }
  if (data.success && data.data) {
    return data.data
  }

  return data
}

export default function PublicUserProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const { data: user, isPending, isError } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  })

  if (isPending) {
    return (
      <Page className="p-0">
        <div className="h-48 bg-muted animate-pulse" />
        <Container className="py-8">
          <div className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto -mt-16" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-20 w-full max-w-2xl mx-auto" />
          </div>
        </Container>
      </Page>
    )
  }

  if (isError || !user) {
    return (
      <Page>
        <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="text-muted-foreground">
              The user you're looking for doesn't exist
            </p>
          </div>
        </Container>
      </Page>
    )
  }

  return (
    <Page className="p-0">
      <PublicProfileView user={user} isOwnProfile={false} />
    </Page>
  )
}
