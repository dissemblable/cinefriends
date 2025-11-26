"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserFilms, useDeleteFilm } from "../hooks/useFilms"
import { ProfileFilmCard } from "./ProfileFilmCard"
import { EditFilmModal } from "./EditFilmModal"
import { Button } from "@/components/ui/button"
import { Film } from "@/lib/api/films"
import { Plus, Loader2 } from "lucide-react"

export function FilmsManagementPage() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: films = [], isLoading, error } = useUserFilms(selectedStatus)
  const deleteFilmMutation = useDeleteFilm()

  const statusFilters = [
    { value: undefined, label: "All Movies" },
    { value: "watched", label: "Watched" },
    { value: "watching", label: "Currently Watching" },
    { value: "plan-to-watch", label: "Plan to Watch" },
  ]

  const handleEdit = (film: Film) => {
    setSelectedFilm(film)
    setIsEditModalOpen(true)
  }

  const handleDelete = (film: Film) => {
    deleteFilmMutation.mutate(film.id)
  }

  const stats = {
    total: films.length,
    watched: films.filter((f) => f.status === "watched").length,
    watching: films.filter((f) => f.status === "watching").length,
    planToWatch: films.filter((f) => f.status === "plan-to-watch").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Movies</h1>
          <p className="text-gray-600 mt-1">
            {stats.total} movie{stats.total !== 1 ? "s" : ""} • {stats.watched} watched • {stats.watching} currently watching • {stats.planToWatch} plan to watch
          </p>
        </div>
        <Button onClick={() => router.push("/films")} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Movie
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value || "all"}
            onClick={() => setSelectedStatus(filter.value)}
            variant={selectedStatus === filter.value ? "default" : "outline"}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Films Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading movies</p>
        </div>
      ) : films.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {selectedStatus && selectedStatus !== "all"
              ? "No movies in this category"
              : "No movies in your list yet"}
          </p>
          <Button onClick={() => router.push("/films")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Movie
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {films.map((film) => (
            <ProfileFilmCard
              key={film.id}
              film={film}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EditFilmModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedFilm(null)
        }}
        film={selectedFilm}
      />
    </div>
  )
}
