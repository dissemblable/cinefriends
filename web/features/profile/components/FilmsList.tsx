"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Film } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { FilmCard } from "./FilmCard"

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

interface FilmsListProps {
  films: Film[]
}

type FilterStatus = "all" | "watched" | "watching" | "plan-to-watch"

export function FilmsList({ films }: FilmsListProps) {
  const [filter, setFilter] = useState<FilterStatus>("all")

  const filteredFilms =
    filter === "all" ? films : films.filter((f) => f.status === filter)

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Films</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "watched" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("watched")}
          >
            Watched
          </Button>
          <Button
            variant={filter === "watching" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("watching")}
          >
            Watching
          </Button>
        </div>
      </div>

      {filteredFilms.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}

      {filteredFilms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === "all"
                ? "No films yet"
                : `No ${filter.replace("-", " ")} films`}
            </p>
            <Button asChild className="mt-4">
              <Link href="/films">Browse Films</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
