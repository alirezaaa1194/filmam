-- AlterTable
ALTER TABLE "section_movies" ADD COLUMN     "entity_type" "CommentEntityType" NOT NULL DEFAULT 'MOVIE',
ADD COLUMN     "episode_id" INTEGER;

-- AddForeignKey
ALTER TABLE "section_movies" ADD CONSTRAINT "section_movies_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
