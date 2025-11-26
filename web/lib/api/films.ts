const API_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:5000"

export interface Film {
  id: string
  userId: string
  tmdbId: number
  title: string
  posterUrl: string
  year: number
  status: "watched" | "watching" | "plan-to-watch"
  rating: number
  review: string | null
  watchedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateFilmInput {
  tmdbId: number
  title: string
  posterUrl: string
  year: number
  status?: "watched" | "watching" | "plan-to-watch"
  rating?: number
  review?: string
  watchedAt?: string
}

export interface UpdateFilmInput {
  status?: "watched" | "watching" | "plan-to-watch"
  rating?: number
  review?: string
  watchedAt?: string | null
}

const getHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
  }
}

export const filmsAPI = {
  async getFilms(): Promise<Film[]> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/films`, {
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch films: ${response.statusText}`)
    }

    return response.json()
  },

  async getUserFilms(userId: string): Promise<Film[]> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/users/${userId}/films`, {
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user films: ${response.statusText}`)
    }

    return response.json()
  },

  async getFilm(id: string): Promise<Film> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/films/${id}`, {
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch film: ${response.statusText}`)
    }

    return response.json()
  },

  async createFilm(data: CreateFilmInput): Promise<Film> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/films`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to create film: ${response.statusText}`)
    }

    return response.json()
  },

  async updateFilm(id: string, data: UpdateFilmInput): Promise<Film> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/films/${id}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to update film: ${response.statusText}`)
    }

    return response.json()
  },

  async deleteFilm(id: string): Promise<void> {
    const headers = getHeaders()
    const response = await fetch(`${API_URL}/api/films/${id}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to delete film: ${response.statusText}`)
    }
  },
}
