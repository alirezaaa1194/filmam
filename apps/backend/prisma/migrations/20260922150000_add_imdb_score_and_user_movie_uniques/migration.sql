-- AlterTable
ALTER TABLE "movies" ADD COLUMN "imdb_score" DOUBLE PRECISION;

-- Deduplicate movie-level reaction rows before unique indexes
DELETE FROM "user_movies" a
USING "user_movies" b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.movie_id IS NOT DISTINCT FROM b.movie_id
  AND a.type = b.type
  AND a.entity_type = 'MOVIE'
  AND a.type IN ('LIKE', 'DISLIKE', 'BOOKMARK', 'NOTIFICATION');

-- Deduplicate episode-level LIKE/DISLIKE rows
DELETE FROM "user_movies" a
USING "user_movies" b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.episode_id IS NOT DISTINCT FROM b.episode_id
  AND a.type = b.type
  AND a.entity_type = 'EPISODE'
  AND a.type IN ('LIKE', 'DISLIKE');

-- Deduplicate episode watch rows (keep most recently updated)
DELETE FROM "user_movies" a
USING "user_movies" b
WHERE a.id > b.id
  AND a.user_id = b.user_id
  AND a.episode_id IS NOT DISTINCT FROM b.episode_id
  AND a.entity_type = 'EPISODE'
  AND a.type IN ('WATCHING', 'WATCHED')
  AND b.type IN ('WATCHING', 'WATCHED');

-- Unique indexes to prevent duplicate reactions / watch rows
CREATE UNIQUE INDEX "user_movies_user_movie_type_unique"
ON "user_movies" ("user_id", "movie_id", "type")
WHERE "entity_type" = 'MOVIE'
  AND "type" IN ('LIKE', 'DISLIKE', 'BOOKMARK', 'NOTIFICATION')
  AND "movie_id" IS NOT NULL;

CREATE UNIQUE INDEX "user_movies_user_episode_type_unique"
ON "user_movies" ("user_id", "episode_id", "type")
WHERE "entity_type" = 'EPISODE'
  AND "type" IN ('LIKE', 'DISLIKE')
  AND "episode_id" IS NOT NULL;

CREATE UNIQUE INDEX "user_movies_user_episode_watch_unique"
ON "user_movies" ("user_id", "episode_id")
WHERE "entity_type" = 'EPISODE'
  AND "type" IN ('WATCHING', 'WATCHED')
  AND "episode_id" IS NOT NULL;
