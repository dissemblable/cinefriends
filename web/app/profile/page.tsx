"use client"

import Container from "@/components/Container"
import Page from "@/components/Page"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/utils"
import { PublicProfileView } from "@/features/profile"

export default function ProfilePage() {
  const { data: session, isPending } = useSession()

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

  if (!session?.user) {
    return (
      <Page>
        <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Not authenticated</h1>
            <p className="text-muted-foreground">
              Please sign in to view your profile
            </p>
          </div>
        </Container>
      </Page>
    )
  }

  return (
    <Page className="p-0">
      <PublicProfileView user={session.user} isOwnProfile={true} />
    </Page>
  )
}
