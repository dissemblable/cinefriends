"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { searchMovies } from "@/lib/api/tmdb"
import { Loader2, Plus } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useAddFilm } from "../hooks/useFilms"

interface SearchResult {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
}

export function AddFilmModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const addFilmMutation = useAddFilm()

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchMovies(query, 1)
      setSearchResults(results.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleAddFilm = async (movie: SearchResult) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder-movie.png"

    const year = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : new Date().getFullYear()

    await addFilmMutation.mutateAsync({
      tmdbId: movie.id,
      title: movie.title,
      posterUrl,
      year,
      status: "plan-to-watch",
    })

    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Movie</DialogTitle>
          <DialogDescription>
            Search for a movie to add it to your list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
          />

          {isSearching && (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="flex gap-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  {movie.poster_path && (
                    <div className="shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        width={50}
                        height={75}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{movie.title}</p>
                    {movie.release_date && (
                      <p className="text-sm text-gray-500">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {movie.overview}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFilm(movie)}
                    disabled={addFilmMutation.isPending}
                    className="shrink-0"
                  >
                    {addFilmMutation.isPending ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchQuery && searchResults.length === 0 && (
            <p className="text-center text-gray-500 py-8">No movies found</p>
          )}

          {!searchQuery && searchResults.length === 0 && !isSearching && (
            <p className="text-center text-gray-400 py-8">
              Enter a movie title
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
