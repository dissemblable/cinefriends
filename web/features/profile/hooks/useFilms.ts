"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { filmsAPI, CreateFilmInput, UpdateFilmInput, Film } from "@/lib/api/films"

export const useUserFilms = (statusFilter?: string) => {
  return useQuery({
    queryKey: ["films", statusFilter],
    queryFn: async () => {
      const films = await filmsAPI.getFilms()
      if (statusFilter && statusFilter !== "all") {
        return films.filter((film) => film.status === statusFilter)
      }
      return films
    },
  })
}

export const useAddFilm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFilmInput) => filmsAPI.createFilm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] })
    },
  })
}

export const useUpdateFilm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFilmInput }) =>
      filmsAPI.updateFilm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] })
    },
  })
}

export const useDeleteFilm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => filmsAPI.deleteFilm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] })
    },
  })
}

export const useUserPublicFilms = (userId: string) => {
  return useQuery({
    queryKey: ["films", "public", userId],
    queryFn: async () => {
      return await filmsAPI.getUserFilms(userId)
    },
  })
}
