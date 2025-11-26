const TMDB_API_KEY = process.env.KEY_API_MOVIES_DB
const TMDB_ACCESS_TOKEN = process.env.TOKENS_MOVIES_DB
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  video: boolean
}

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface GenresResponse {
  genres: Genre[]
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[]
  budget: number
  revenue: number
  runtime: number | null
  status: string
  tagline: string | null
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

const fetchFromTMDB = async (endpoint: string) => {
  const url = `${TMDB_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Discover movies with filters
 */
export interface DiscoverFilters {
  page?: number
  genre?: string
  year?: string
  sort_by?: string
}

export const discoverMovies = async (filters: DiscoverFilters = {}): Promise<MoviesResponse> => {
  const params = new URLSearchParams({
    language: 'en-US',
    page: (filters.page || 1).toString(),
  })

  if (filters.genre) {
    params.set('with_genres', filters.genre)
  }

  if (filters.year) {
    params.set('primary_release_year', filters.year)
  }

  if (filters.sort_by) {
    params.set('sort_by', filters.sort_by)
  } else {
    params.set('sort_by', 'popularity.desc')
  }

  return fetchFromTMDB(`/discover/movie?${params.toString()}`)
}

/**
 * Get popular movies
 */
export const getPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
  return fetchFromTMDB(`/movie/popular?page=${page}&language=en-US`)
}

/**
 * Get now playing movies
 */
export const getNowPlayingMovies = async (page: number = 1): Promise<MoviesResponse> => {
  return fetchFromTMDB(`/movie/now_playing?page=${page}&language=en-US`)
}

/**
 * Get upcoming movies
 */
export const getUpcomingMovies = async (page: number = 1): Promise<MoviesResponse> => {
  return fetchFromTMDB(`/movie/upcoming?page=${page}&language=en-US`)
}

/**
 * Get top rated movies
 */
export const getTopRatedMovies = async (page: number = 1): Promise<MoviesResponse> => {
  return fetchFromTMDB(`/movie/top_rated?page=${page}&language=en-US`)
}

/**
 * Search movies by query
 */
export const searchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  const encodedQuery = encodeURIComponent(query)
  return fetchFromTMDB(`/search/movie?query=${encodedQuery}&page=${page}&language=en-US`)
}

/**
 * Get movie details by ID
 */
export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return fetchFromTMDB(`/movie/${movieId}?language=en-US`)
}

/**
 * Get movie credits (cast and crew)
 */
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  return fetchFromTMDB(`/movie/${movieId}/credits`)
}

/**
 * Get similar movies
 */
export const getSimilarMovies = async (movieId: number, page: number = 1): Promise<MoviesResponse> => {
  return fetchFromTMDB(`/movie/${movieId}/similar?page=${page}&language=en-US`)
}

/**
 * Get movie genres
 */
export const getMovieGenres = async (): Promise<GenresResponse> => {
  return fetchFromTMDB('/genre/movie/list?language=en-US')
}

/**
 * Helper function to get full image URL
 */
export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

/**
 * Helper function to get backdrop image URL
 */
export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '/placeholder-backdrop.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
