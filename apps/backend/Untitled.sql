CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "password" varchar(255),
  "role" enum(user,admin),
  "created_at" timestamp
);

CREATE TABLE "movies" (
  "id" integer PRIMARY KEY,
  "type" enum(cinematic,series),
  "seasons_count" integer(nullable),
  "slug" varchar,
  "created_at" timestamp
);

CREATE TABLE "movie_translations" (
  "title" varchar,
  "short_description" varchar,
  "description" varchar,
  "country" varchar,
  "movie_language" varchar,
  "language" enum(fa,en,ar),
  "movie_id" integer,
  "created_at" timestamp
);

CREATE TABLE "seasons" (
  "id" integer PRIMARY KEY,
  "season_number" integer,
  "movie_id" integer,
  "created_at" timestamp
);

CREATE TABLE "season_translations" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "season_id" integer,
  "created_at" timestamp
);

CREATE TABLE "episodes" (
  "id" integer PRIMARY KEY,
  "episode_number" integer,
  "season_id" integer,
  "movie_id" integer,
  "created_at" timestamp
);

CREATE TABLE "episode_translations" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "episode_id" integer,
  "created_at" timestamp
);

CREATE TABLE "films" (
  "id" integer PRIMARY KEY,
  "duration" varchar,
  "type" enum(cinematic,trailer),
  "movie_id" integer,
  "created_at" timestamp
);

CREATE TABLE "comments" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "likes_count" integer,
  "dislikes_count" integer,
  "status" enum(approved,rejected,pending),
  "parent_id" integer,
  "entity_id" integer,
  "entity_type" enum(movie,episode),
  "body" text,
  "created_at" timestamp
);

CREATE TABLE "factors" (
  "id" integer PRIMARY KEY,
  "created_at" timestamp
);

CREATE TABLE "factor_translations" (
  "id" integer PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "factor_id" integer,
  "created_at" timestamp
);

CREATE TABLE "movie_factors" (
  "id" integer PRIMARY KEY,
  "movie_id" integer,
  "factor_id" integer,
  "role_id" integer,
  "created_at" timestamp
);

CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "slug" varchar,
  "created_at" timestamp
);

CREATE TABLE "role_translations" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "role_id" integer,
  "created_at" timestamp
);

CREATE TABLE "genres" (
  "id" integer PRIMARY KEY,
  "slug" varchar,
  "created_at" timestamp
);

CREATE TABLE "genre_translations" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "genre_id" integer,
  "created_at" timestamp
);

CREATE TABLE "movie_genres" (
  "id" integer PRIMARY KEY,
  "genre_id" integer,
  "movie_id" integer,
  "created_at" timestamp
);

CREATE TABLE "user_movies" (
  "id" integer PRIMARY KEY,
  "movie_id" integer,
  "user_id" integer,
  "type" enum(bookmark,like,recent_watch),
  "created_at" timestamp
);

CREATE TABLE "uploads" (
  "id" integer PRIMARY KEY,
  "src" varchar,
  "media_type" enum(image,video),
  "alt_text" varchar,
  "entity_type" enum(factor_profile,movie_cover,season_cover,episode_cover,movie_video,episode_video),
  "entity_id" integer,
  "created_at" timestamp
);

CREATE TABLE "tickets" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "subject" varchar(nullable),
  "body" varchar,
  "parent_id" integer(nullable),
  "status" enum(approved,pending),
  "created_at" timestamp
);

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "user_movies" ("user_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "comments" ("user_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "tickets" ("user_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "comments" ("entity_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "movie_translations" ("movie_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "movie_genres" ("movie_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "films" ("movie_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "seasons" ("movie_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "episodes" ("movie_id");

ALTER TABLE "movies" ADD FOREIGN KEY ("id") REFERENCES "uploads" ("entity_id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("id") REFERENCES "uploads" ("entity_id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("id") REFERENCES "episodes" ("season_id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("id") REFERENCES "season_translations" ("season_id");

ALTER TABLE "episodes" ADD FOREIGN KEY ("id") REFERENCES "uploads" ("entity_id");

ALTER TABLE "episodes" ADD FOREIGN KEY ("id") REFERENCES "comments" ("entity_id");

ALTER TABLE "episodes" ADD FOREIGN KEY ("id") REFERENCES "episode_translations" ("episode_id");

ALTER TABLE "comments" ADD FOREIGN KEY ("id") REFERENCES "comments" ("parent_id");

ALTER TABLE "factors" ADD FOREIGN KEY ("id") REFERENCES "factor_translations" ("factor_id");

ALTER TABLE "factors" ADD FOREIGN KEY ("id") REFERENCES "uploads" ("entity_id");

ALTER TABLE "movie_factors" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id");

ALTER TABLE "movie_factors" ADD FOREIGN KEY ("factor_id") REFERENCES "factors" ("id");

ALTER TABLE "movie_factors" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "roles" ADD FOREIGN KEY ("id") REFERENCES "role_translations" ("role_id");

ALTER TABLE "genres" ADD FOREIGN KEY ("id") REFERENCES "genre_translations" ("genre_id");

ALTER TABLE "genres" ADD FOREIGN KEY ("id") REFERENCES "movie_genres" ("genre_id");

ALTER TABLE "films" ADD FOREIGN KEY ("id") REFERENCES "uploads" ("entity_id");

ALTER TABLE "user_movies" ADD FOREIGN KEY ("movie_id") REFERENCES "movies" ("id");
