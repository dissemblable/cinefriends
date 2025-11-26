import Container from "@/components/Container";
import Page from "@/components/Page";
import { FiltersBar } from "@/features/films/components/FiltersBar";
import { MoviesGrid } from "@/features/films/components/MoviesGrid";
import { Pagination } from "@/features/films/components/Pagination";
import { SearchBar } from "@/features/films/components/SearchBar";
import { discoverMovies, searchMovies } from "@/lib/api/tmdb";

export const metadata = {
  title: "CineFriends | Discover & Share Amazing Films",
  description: "Discover popular, now playing, and top rated movies",
};

interface HomePageProps {
  readonly searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    year?: string;
    sort_by?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.query;

  const moviesData = searchQuery
    ? await searchMovies(searchQuery, currentPage)
    : await discoverMovies({
        page: currentPage,
        genre: params.genre,
        year: params.year,
        sort_by: params.sort_by,
      });

  return (
    <Page>
      <Container>
        {/* Header Section */}
        <div className="pt-8 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">
            Discover Movies
          </h1>
          <p className="text-muted-foreground text-center text-lg">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : `Explore thousands of movies from our collection`}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4 mb-8">
          <SearchBar />
          <FiltersBar />
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {searchQuery ? "Search Results" : "All Movies"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {moviesData.total_results.toLocaleString()} movies found
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.min(moviesData.total_pages, 500)}
          </div>
        </div>

        <MoviesGrid movies={moviesData.results} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.min(moviesData.total_pages, 500)}
        />
      </Container>
    </Page>
  );
}
