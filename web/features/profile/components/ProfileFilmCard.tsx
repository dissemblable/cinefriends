"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Film } from "@/lib/api/films"
import { Edit2, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProfileFilmCardProps {
  film: Film
  onEdit: (film: Film) => void
  onDelete: (film: Film) => void
}

export function ProfileFilmCard({
  film,
  onEdit,
  onDelete,
}: ProfileFilmCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const statusLabel = {
    watched: "Watched",
    watching: "Currently Watching",
    "plan-to-watch": "Plan to Watch",
  }

  const statusColor = {
    watched: "bg-green-100 text-green-800",
    watching: "bg-blue-100 text-blue-800",
    "plan-to-watch": "bg-gray-100 text-gray-800",
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      onDelete(film)
    } finally {
      setIsDeleting(false)
      setIsAlertOpen(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Poster */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={film.posterUrl}
          alt={film.title}
          fill
          className="object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src = "/placeholder-movie.png"
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Year */}
        <div>
          <h3 className="font-semibold truncate">{film.title}</h3>
          <p className="text-sm text-gray-500">{film.year}</p>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            statusColor[film.status]
          }`}
        >
          {statusLabel[film.status]}
        </div>

        {/* Rating */}
        {film.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= film.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{film.rating}/5</span>
          </div>
        )}

        {/* Review Preview */}
        {film.review && (
          <p className="text-sm text-gray-600 line-clamp-2">{film.review}</p>
        )}

        {/* Watched Date */}
        {film.watchedAt && (
          <p className="text-xs text-gray-500">
            Watched on {new Date(film.watchedAt).toLocaleDateString("en-US")}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(film)}
          >
            <Edit2 size={16} className="mr-1" />
            Edit
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isDeleting}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Movie</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{film.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
