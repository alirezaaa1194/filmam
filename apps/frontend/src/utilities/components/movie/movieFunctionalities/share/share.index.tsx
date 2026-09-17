import { Button } from "../../../ui";
import { Share2 } from "lucide-react";

function MovieShareFunctionalityComp() {
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <Button onClick={handleShare} className={`size-9 lg:size-14 rounded-md lg:rounded-lg cursor-pointer bg-white/7! backdrop-blur-[12px] border border-white/10 hover:border-white`}>
      <Share2 className="size-5 lg:size-7 transition-all stroke-white" />
    </Button>
  );
}

export default MovieShareFunctionalityComp;
