"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";

const SectionTitleWithBackButton = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="flex flex-row justify-between py-3 pr-3 pb-5">
      <h2 className="px-3 pr-5 font-extrabold rounded-br-full bg-shatibi-orange w-fit h-7 text-white">
        {title}
      </h2>

      <Button
        className="h-8 w-28 text-m"
        onClick={() => router.back()}
        variant="red"
      >
        Retour
      </Button>
    </div>
  );
};

export default SectionTitleWithBackButton;
