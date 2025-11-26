"use client"

import { useSession } from "@/features/auth/utils"
import { FilmsManagementPage } from "@/features/profile/components/FilmsManagementPage"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Page from "@/components/Page"
import Container from "@/components/Container"

export default function FilmsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/signin")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <Page>
        <Container>
          <div className="py-8 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
            <div className="flex gap-2 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Page>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <Page>
      <Container>
        <div className="py-8">
          <FilmsManagementPage />
        </div>
      </Container>
    </Page>
  )
}
