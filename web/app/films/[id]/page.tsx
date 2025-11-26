import Container from "@/components/Container";
import Page from "@/components/Page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getBackdropUrl,
  getImageUrl,
  getMovieCredits,
  getMovieDetails,
  getSimilarMovies,
  type CastMember,
  type Credits,
  type CrewMember,
  type MovieDetails,
  type MoviesResponse,
} from "@/lib/api/tmdb";
import {
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Film,
  Globe,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(Number(id));
    return {
      title: `${movie.title} - CineFriends`,
      description: movie.overview || `Watch ${movie.title}`,
    };
  } catch {
    return {
      title: "Movie Not Found - CineFriends",
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  let movie: MovieDetails;
  let credits: Credits;
  let similarMovies: MoviesResponse;
  let backdropUrl: string;
  let posterUrl: string;
  let director: CrewMember | undefined;
  let topCast: CastMember[];

  try {
    [movie, credits, similarMovies] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getSimilarMovies(movieId),
    ]);

    backdropUrl = getBackdropUrl(movie.backdrop_path, "original");
    posterUrl = getImageUrl(movie.poster_path, "w500");
    director = credits.crew.find((member) => member.job === "Director");
    topCast = credits.cast.slice(0, 10);
  } catch (error) {
    notFound();
  }

  return (
    <Page>
      <div className="relative w-full h-[50vh] md:h-[60vh] -mt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20 z-10" />
        {movie.backdrop_path ? (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Film className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      <Container className="-mt-32 relative z-20">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
          <div className="flex justify-center md:justify-start">
            <Card className="overflow-hidden w-full max-w-[300px] border-2 p-0">
              <div className="relative aspect-[2/3]">
                {movie.poster_path ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Film className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>

              {movie.release_date && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {director && (
              <div>
                <span className="font-semibold">Director: </span>
                <span className="text-muted-foreground">{director.name}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {movie.homepage && (
                <Button asChild variant="default">
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Official Website
                  </a>
                </Button>
              )}
              {movie.imdb_id && (
                <Button asChild variant="outline">
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on IMDb
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Budget</h3>
              </div>
              <p className="text-2xl font-bold">
                {movie.budget > 0 ? formatCurrency(movie.budget) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Revenue</h3>
              </div>
              <p className="text-2xl font-bold">
                {movie.revenue > 0 ? formatCurrency(movie.revenue) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Film className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Status</h3>
              </div>
              <p className="text-2xl font-bold">{movie.status}</p>
            </CardContent>
          </Card>
        </div>

        {topCast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {topCast.map((actor) => (
                <Card key={actor.id} className="overflow-hidden p-0">
                  <div className="relative aspect-[2/3] bg-muted">
                    {actor.profile_path ? (
                      <Image
                        src={getImageUrl(actor.profile_path, "w185")}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 pt-0">
                    <p className="font-semibold text-sm line-clamp-1">
                      {actor.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {actor.character}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {similarMovies.results.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarMovies.results.slice(0, 10).map((similarMovie) => (
                <Link
                  key={similarMovie.id}
                  href={`/films/${similarMovie.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-105 p-0">
                    <div className="relative aspect-[2/3] bg-muted">
                      {similarMovie.poster_path ? (
                        <Image
                          src={getImageUrl(similarMovie.poster_path, "w342")}
                          alt={similarMovie.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-white">
                          {similarMovie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-3 pt-0">
                      <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {similarMovie.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </Page>
  );
}
