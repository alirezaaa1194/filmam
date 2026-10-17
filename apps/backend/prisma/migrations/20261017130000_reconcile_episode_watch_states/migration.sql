-- Reconcile databases where the legacy partial unique index survived the
-- earlier migration. WATCHING and WATCHED are separate user movie actions.
DROP INDEX IF EXISTS "user_movies_user_episode_watch_unique";
