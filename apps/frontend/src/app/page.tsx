import { getTranslations } from "next-intl/server";
import MovieCard from "../features/movies/components/movie-card/movie-card.index";

export default async function HomePage() {
  const t = await getTranslations("Layout");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <MovieCard />
    </div>
  );
}
