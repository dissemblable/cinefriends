"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useUpdateFilm } from "../hooks/useFilms"
import { Film } from "@/lib/api/films"
import { Loader2, Star } from "lucide-react"

interface EditFilmModalProps {
  isOpen: boolean
  onClose: () => void
  film: Film | null
}

export function EditFilmModal({ isOpen, onClose, film }: EditFilmModalProps) {
  const [status, setStatus] = useState<string>("plan-to-watch")
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>("")
  const [watchedAt, setWatchedAt] = useState<string>("")
  const updateFilmMutation = useUpdateFilm()

  useEffect(() => {
    if (film) {
      setStatus(film.status)
      setRating(film.rating)
      setReview(film.review || "")
      setWatchedAt(film.watchedAt ? film.watchedAt.split("T")[0] : "")
    }
  }, [film])

  const handleSave = async () => {
    if (!film) return

    await updateFilmMutation.mutateAsync({
      id: film.id,
      data: {
        status: status as "watched" | "watching" | "plan-to-watch",
        rating,
        review: review || undefined,
        watchedAt: watchedAt ? watchedAt : null,
      },
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit: {film?.title}</DialogTitle>
          <DialogDescription>Update this movie information</DialogDescription>
        </DialogHeader>

        {film && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plan-to-watch">Plan to Watch</SelectItem>
                  <SelectItem value="watching">Currently Watching</SelectItem>
                  <SelectItem value="watched">Watched</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{rating}/5</p>
            </div>

            {status === "watched" && (
              <div>
                <Label htmlFor="watchedAt">Watch Date</Label>
                <Input
                  id="watchedAt"
                  type="date"
                  value={watchedAt}
                  onChange={(e) => setWatchedAt(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="review">Review (optional)</Label>
              <Textarea
                id="review"
                placeholder="Share your thoughts..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateFilmMutation.isPending}
              >
                {updateFilmMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
