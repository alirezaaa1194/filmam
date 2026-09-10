import pic from "@/assets/images/Image1.png";
import Image from "next/image";

function PuzzleSliderItemComp() {
  return (
    <div className="w-full h-full">
      <Image src={pic} alt="pic" className="w-full h-full object-cover rounded-xl" />
      <div className="absolute inset-x-0 bottom-0 w-full lg:min-h-14 bg-black/30 backdrop-blur-[10px] z-10 rounded-b-xl flex items-center justify-baseline p-3">
        <h6 className="text-h-6 text-white">رئالیتی شو ناتو</h6>
      </div>
    </div>
  );
}

export default PuzzleSliderItemComp;
