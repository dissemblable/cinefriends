import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Film, Users } from "lucide-react"
import type { UserProfile } from "../types"

interface Film {
  id: string
  status: "watched" | "watching" | "plan-to-watch"
  review: string | null
}

interface ProfileSidebarProps {
  user: UserProfile
  films: Film[]
}

export function ProfileSidebar({ user, films }: ProfileSidebarProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  const watchedFilms = films.filter((f) => f.status === "watched")
  const watchingFilms = films.filter((f) => f.status === "watching")

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            About
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {user.bio || "No bio yet"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Member since {memberSince}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Film className="h-4 w-4" />
            Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Films</span>
              <span className="font-bold">{films.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Watched</span>
              <span className="font-bold">{watchedFilms.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Watching</span>
              <span className="font-bold">{watchingFilms.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reviews</span>
              <span className="font-bold">
                {watchedFilms.filter((f) => f.review).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
