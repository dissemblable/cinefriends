"use client"

import Container from "@/components/Container"
import Page from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/utils"
import { ProfileEditForm } from "@/features/profile"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function ProfileEditPage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <Page>
        <Container className="py-8 max-w-2xl">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Container>
      </Page>
    )
  }

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <Page>
      <Container className="py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground mt-2">
            Update your profile information and preferences
          </p>
        </div>
        <ProfileEditForm user={session.user} />
      </Container>
    </Page>
  )
}
