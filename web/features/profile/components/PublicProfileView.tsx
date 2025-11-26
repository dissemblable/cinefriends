"use client"

import Container from "@/components/Container"
import { signOut } from "@/features/auth/utils"
import { useRouter } from "next/navigation"
import type { UserProfile } from "../types"
import { useUserPublicFilms } from "../hooks/useFilms"
import { FilmsList } from "./FilmsList"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileSidebar } from "./ProfileSidebar"

interface PublicProfileViewProps {
  user: UserProfile
  isOwnProfile?: boolean
}

export function PublicProfileView({
  user,
  isOwnProfile = false,
}: PublicProfileViewProps) {
  const router = useRouter()
  const { data: films = [], isLoading } = useUserPublicFilms(user.id)

  const handleSignOut = async () => {
    await signOut()
    router.push("/signin")
  }

  return (
    <div className="w-full">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onSignOut={handleSignOut}
      />

      <Container className="pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileSidebar user={user} films={films} />
          {!isLoading && <FilmsList films={films} />}
        </div>
      </Container>
    </div>
  )
}
