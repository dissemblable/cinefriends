import Container from "@/components/Container"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FriendshipButton } from "@/features/friends/components/FriendshipButton"
import { LogOut, Settings } from "lucide-react"
import Link from "next/link"
import type { UserProfile } from "../types"

interface ProfileHeaderProps {
  user: UserProfile
  isOwnProfile: boolean
  onSignOut: () => void
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onSignOut,
}: ProfileHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  return (
    <div className="relative h-32 bg-linear-to-br from-primary/20 via-primary/5 to-background border-b">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <Container className="relative h-full">
        <div className="absolute top-6 right-0 flex gap-2">
          {isOwnProfile ? (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/profile/edit">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <FriendshipButton userId={user.id} />
          )}
        </div>

        <div className="absolute -bottom-16 left-0 flex items-end gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-4xl bg-linear-to-br from-primary to-primary/60 text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="pb-4 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {user.emailVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              @{user.name.toLowerCase().replace(/\s+/g, "")}
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
