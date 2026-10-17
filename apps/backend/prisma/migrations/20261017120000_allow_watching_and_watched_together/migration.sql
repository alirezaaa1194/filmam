-- Keep one progress row per user and episode action type. WATCHING and WATCHED
-- represent independent states and may both exist for the same episode.
DROP INDEX IF EXISTS "user_movies_user_episode_watch_unique";
