import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import type { UserProfile } from "../types"

interface AvatarSectionProps {
  user: UserProfile
  imageUrl?: string
}

export function AvatarSection({ user, imageUrl }: AvatarSectionProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const displayImage = imageUrl || user.image

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={displayImage || undefined} alt={user.name} />
          <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="rounded-full h-10 w-10 shadow-md"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
