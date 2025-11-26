import { redirect } from "next/navigation";

interface FilmsPageProps {
  readonly searchParams: Promise<{
    page?: string;
    query?: string;
    genre?: string;
    year?: string;
    sort_by?: string;
  }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const params = await searchParams;

  const searchParamsString = new URLSearchParams(
    Object.entries(params).filter(([_, value]) => value !== undefined) as [
      string,
      string
    ][]
  ).toString();

  redirect(searchParamsString ? `/?${searchParamsString}` : "/");
}
