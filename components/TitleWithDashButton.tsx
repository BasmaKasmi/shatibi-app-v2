"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";
import useSelectedDates from "@/hooks/useSelectedDates";

type TitleWithDashButtonProps = {
  title: string;
  pageKey: string;
};

const TitleWithDashButton = ({ title, pageKey }: TitleWithDashButtonProps) => {
  const router = useRouter();
  const { resetDates } = useSelectedDates(pageKey);

  const handleReturn = () => {
    resetDates();
    router.push("/home");
  };

  return (
    <div className="flex flex-row justify-between py-3 pr-3 pb-5">
      <h2 className="px-3 pr-5 font-extrabold rounded-br-full bg-shatibi-orange w-fit h-7 text-white">
        {title}
      </h2>
      <Button className="h-8 w-28 text-m" onClick={handleReturn} variant="red">
        Retour
      </Button>
    </div>
  );
};

export default TitleWithDashButton;
