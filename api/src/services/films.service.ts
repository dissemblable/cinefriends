import { PrismaClient } from "../generated/prisma/client.js"

const prisma = new PrismaClient()

export const filmsService = {
  async getUserFilms(userId: string) {
    return await prisma.film.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  },

  async getUserFilmsPublic(userId: string) {
    return await prisma.film.findMany({
      where: { userId },
      select: {
        id: true,
        tmdbId: true,
        title: true,
        posterUrl: true,
        year: true,
        status: true,
        rating: true,
        review: true,
        watchedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async getFilmById(id: string) {
    return await prisma.film.findUnique({
      where: { id },
    })
  },

  async createFilm(
    userId: string,
    data: {
      tmdbId: number
      title: string
      posterUrl: string
      year: number
      status?: string
      rating?: number
      review?: string
      watchedAt?: Date
    }
  ) {
    return await prisma.film.create({
      data: {
        userId,
        tmdbId: data.tmdbId,
        title: data.title,
        posterUrl: data.posterUrl,
        year: data.year,
        status: data.status || "plan-to-watch",
        rating: data.rating || 0,
        review: data.review || null,
        watchedAt: data.watchedAt || null,
      },
    })
  },

  async updateFilm(
    id: string,
    userId: string,
    data: {
      status?: string
      rating?: number
      review?: string
      watchedAt?: Date | null
    }
  ) {
    const film = await prisma.film.findUnique({
      where: { id },
    })

    if (!film) {
      throw new Error("Film not found")
    }

    if (film.userId !== userId) {
      throw new Error("Unauthorized")
    }

    return await prisma.film.update({
      where: { id },
      data: {
        status: data.status !== undefined ? data.status : film.status,
        rating: data.rating !== undefined ? data.rating : film.rating,
        review: data.review !== undefined ? data.review : film.review,
        watchedAt:
          data.watchedAt !== undefined ? data.watchedAt : film.watchedAt,
      },
    })
  },

  async deleteFilm(id: string, userId: string) {
    const film = await prisma.film.findUnique({
      where: { id },
    })

    if (!film) {
      throw new Error("Film not found")
    }

    if (film.userId !== userId) {
      throw new Error("Unauthorized")
    }

    return await prisma.film.delete({
      where: { id },
    })
  },
}
