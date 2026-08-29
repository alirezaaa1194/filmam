"use client";
import Image from "next/image";
import pic from "@/assets/images/Image.png";

function HomePageComp() {
  return (
    <div>
      <Image src={pic} alt="test" className="w-full" />
    </div>
  );
}

export default HomePageComp;
