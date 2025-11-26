import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Clock, Eye, MessageSquare, Play, Star } from "lucide-react"

interface Film {
  id: string
  title: string
  posterUrl: string
  year: number
  status: "watched" | "watching" | "plan-to-watch"
  rating: number
  review: string | null
  watchedAt: string | null
}

interface FilmCardProps {
  film: Film
}

const statusConfig = {
  watched: {
    label: "Watched",
    icon: Eye,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  watching: {
    label: "Watching",
    icon: Play,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  "plan-to-watch": {
    label: "Plan to Watch",
    icon: Clock,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
}

export function FilmCard({ film }: FilmCardProps) {
  const StatusIcon = statusConfig[film.status].icon

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="relative flex-shrink-0 w-24 h-36 rounded-md overflow-hidden bg-muted">
          <img
            src={film.posterUrl}
            alt={film.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{film.title}</h3>
              <p className="text-sm text-muted-foreground">{film.year}</p>
            </div>
            <Badge
              variant="outline"
              className={statusConfig[film.status].color}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[film.status].label}
            </Badge>
          </div>

          {film.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < film.rating ? "fill-primary text-primary" : "text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {film.rating}/5
              </span>
            </div>
          )}

          {film.review && (
            <div className="bg-muted/50 rounded-md p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Your review
                </span>
              </div>
              <p className="text-sm line-clamp-2">{film.review}</p>
            </div>
          )}

          {film.watchedAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Watched on {new Date(film.watchedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
