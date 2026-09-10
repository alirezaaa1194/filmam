import pic4 from "@/assets/images/image4.webp";
import Image from "next/image";

function KidCardComp() {
  return (
    <div className="relative rounded-xl select-none h-[300px] xl:h-[370px]">
      <Image draggable={false} src={pic4} alt="test" className="w-full h-full object-cover rounded-xl" />
      <div className="absolute bottom-0 left-0 w-full bg-black/30 backdrop-blur-[10px] flex items-center justify-center p-3 rounded-b-md lg:rounded-b-xl">
        <span className="text-white text-caption-sm! lg:text-caption-md!">گناه فرشته</span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 rounded-xl border border-gray-10" />
    </div>
  );
}

export default KidCardComp;
