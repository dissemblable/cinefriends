"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAddFilm } from "../hooks/useFilms"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Movie } from "@/lib/api/tmdb"

interface QuickAddFilmModalProps {
  isOpen: boolean
  onClose: () => void
  movie: Movie | null
}

export function QuickAddFilmModal({ isOpen, onClose, movie }: QuickAddFilmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addFilmMutation = useAddFilm()

  if (!movie) return null

  const handleAddFilm = async () => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder-movie.png"

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : new Date().getFullYear()

    setIsSubmitting(true)
    try {
      await addFilmMutation.mutateAsync({
        tmdbId: movie.id,
        title: movie.title,
        posterUrl,
        year,
        status: "plan-to-watch",
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add to My List</DialogTitle>
          <DialogDescription>
            Add "{movie.title}" to your movie list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Movie Preview */}
          <div className="flex gap-4">
            {movie.poster_path && (
              <div className="flex-shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  width={60}
                  height={90}
                  className="rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold line-clamp-2">{movie.title}</p>
              {movie.release_date && (
                <p className="text-sm text-gray-500">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              )}
              {movie.vote_average > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  ⭐ {movie.vote_average.toFixed(1)}/10
                </p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            The movie will be added with "Plan to Watch" status
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddFilm} disabled={isSubmitting || addFilmMutation.isPending}>
              {isSubmitting || addFilmMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
