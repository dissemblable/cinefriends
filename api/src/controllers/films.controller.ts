import type { Context } from "hono"
import { filmsService } from "../services/films.service.js"

export const filmsController = {
  async getFilms(c: Context) {
    try {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const films = await filmsService.getUserFilms(user.id)
      return c.json(films)
    } catch (error) {
      console.error("Error fetching films:", error)
      return c.json({ error: "Failed to fetch films" }, 500)
    }
  },

  async getUserFilmsPublic(c: Context) {
    try {
      const userId = c.req.param("id")

      if (!userId) {
        return c.json({ error: "User ID is required" }, 400)
      }

      const films = await filmsService.getUserFilmsPublic(userId)
      return c.json(films)
    } catch (error) {
      console.error("Error fetching user films:", error)
      return c.json({ error: "Failed to fetch user films" }, 500)
    }
  },

  async getFilm(c: Context) {
    try {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const id = c.req.param("id")
      const film = await filmsService.getFilmById(id)

      if (!film) {
        return c.json({ error: "Film not found" }, 404)
      }

      if (film.userId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      return c.json(film)
    } catch (error) {
      console.error("Error fetching film:", error)
      return c.json({ error: "Failed to fetch film" }, 500)
    }
  },

  async createFilm(c: Context) {
    try {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const body = await c.req.json()

      const {
        tmdbId,
        title,
        posterUrl,
        year,
        status,
        rating,
        review,
        watchedAt,
      } = body

      if (!tmdbId || !title || !posterUrl || !year) {
        return c.json(
          { error: "Missing required fields: tmdbId, title, posterUrl, year" },
          400
        )
      }

      const film = await filmsService.createFilm(user.id, {
        tmdbId,
        title,
        posterUrl,
        year,
        status: status || "plan-to-watch",
        rating: rating || 0,
        review: review || undefined,
        watchedAt: watchedAt ? new Date(watchedAt) : undefined,
      })

      return c.json(film, 201)
    } catch (error) {
      console.error("Error creating film:", error)
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return c.json({ error: "Film already in your list" }, 400)
      }
      return c.json({ error: "Failed to create film" }, 500)
    }
  },

  async updateFilm(c: Context) {
    try {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const id = c.req.param("id")
      const body = await c.req.json()

      const { status, rating, review, watchedAt } = body

      const film = await filmsService.updateFilm(id, user.id, {
        status,
        rating,
        review,
        watchedAt: watchedAt ? new Date(watchedAt) : watchedAt,
      })

      return c.json(film)
    } catch (error) {
      console.error("Error updating film:", error)
      if (error instanceof Error) {
        if (error.message === "Film not found") {
          return c.json({ error: "Film not found" }, 404)
        }
        if (error.message === "Unauthorized") {
          return c.json({ error: "Unauthorized" }, 401)
        }
      }
      return c.json({ error: "Failed to update film" }, 500)
    }
  },

  async deleteFilm(c: Context) {
    try {
      const user = c.get("user")

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const id = c.req.param("id")

      await filmsService.deleteFilm(id, user.id)

      return c.json({ message: "Film deleted successfully" })
    } catch (error) {
      console.error("Error deleting film:", error)
      if (error instanceof Error) {
        if (error.message === "Film not found") {
          return c.json({ error: "Film not found" }, 404)
        }
        if (error.message === "Unauthorized") {
          return c.json({ error: "Unauthorized" }, 401)
        }
      }
      return c.json({ error: "Failed to delete film" }, 500)
    }
  },
}
