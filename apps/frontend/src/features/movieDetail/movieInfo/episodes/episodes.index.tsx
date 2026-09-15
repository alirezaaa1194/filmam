import { PaginationType, SeasonEpisodeType } from "../../../../types";
import EpisodeCardComp from "./episodeCard/episodeCard.index";

function SeasonEpisodesComp({ episodes }: { episodes: PaginationType<SeasonEpisodeType>[] }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">{episodes.map((page) => page.data.map((episode) => <EpisodeCardComp key={episode.id} episode={episode} />))}</div>;
}

export default SeasonEpisodesComp;
