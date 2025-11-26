import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl, type Movie } from "@/lib/api/tmdb"
import { Calendar, Film, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = getImageUrl(movie.poster_path, "w342")
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A"
  const hasImage = !!movie.poster_path

  return (
    <Link href={`/films/${movie.id}`} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] h-full border-border/50 hover:border-primary/50 p-0">
        <div className="relative aspect-2/3 overflow-hidden bg-muted flex items-center justify-center">
          {hasImage ? (
            <>
              <Image
                src={imageUrl}
                alt={movie.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Film className="h-12 w-12 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                No Image
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2 pt-0">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{releaseYear}</span>
          </div>
          {movie.overview && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {movie.overview}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
