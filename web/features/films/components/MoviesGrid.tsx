"use client"

import { Movie } from "@/lib/api/tmdb"
import { MovieCardWithAdd } from "./MovieCardWithAdd"

interface MoviesGridProps {
  movies: Movie[]
}

export function MoviesGrid({ movies }: MoviesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCardWithAdd key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
