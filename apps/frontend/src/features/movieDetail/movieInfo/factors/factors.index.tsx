import Image from "next/image";
import { MovieDetailPublicType, RoleTypeEnum } from "../../../../types";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { useLocale } from "../../../../hooks";

function EpisodeFactorsComp({ movie }: { movie: MovieDetailPublicType }) {
  const { t } = useLocale();
  const actorFactors = movie.factors?.filter((factor) => factor.role.type === RoleTypeEnum.ACTOR);
  const creatorFactors = movie.factors?.filter((factor) => factor.role.type !== RoleTypeEnum.ACTOR);

  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto flex flex-col gap-4 lg:gap-7">
      <div className="flex flex-col gap-3 lg:gap-4">
        <h5 className="text-white text-mobile-h-6 lg:text-h-5">{t("MovieDetailPage.Actors")}</h5>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          {actorFactors?.map((factor) => (
            <div key={`actor-${factor.id}`} className="flex items-center gap-1.5 lg:gap-2 p-1 border border-gray-11 rounded-full pe-2.5 lg:pe-3">
              <Image src={factor?.profile?.path || userPlaceholder} width={40} height={40} alt={`${factor.first_name} ${factor.last_name}`} className="size-10 lg:size-12 rounded-full bg-gray-11 border border-gray-11 shrink-0 object-cover" />
              <span className="text-caption-md lg:text-body-xs text-white">
                {factor.first_name} {factor.last_name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:gap-4">
        <h5 className="text-white text-mobile-h-6 lg:text-h-5">{t("MovieDetailPage.Factors")}</h5>
        <div className="flex flex-wrap gap-x-5 gap-y-3 lg:gap-x-8 lg:gap-y-5">
          {creatorFactors?.map((factor) => (
            <div key={`creator-${factor.id}`} className="flex flex-col gap-0.5 lg:gap-1">
              <h6 className="text-gray-8 text-mobile-body-sm lg:text-h-6">
                {factor.first_name} {factor.last_name}
              </h6>
              <span className="text-white text-caption-md lg:text-body-xs">{factor.role.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EpisodeFactorsComp;
