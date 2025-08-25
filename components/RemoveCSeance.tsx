"use client";
import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

type RemoveCSeanceModalProps = {
  onValidate: () => void;
  onClickCancel: () => void;
};

const RemoveCSeance = ({ onClickCancel }: RemoveCSeanceModalProps) => {
  const router = useRouter();

  const redirectToPreviousPage = () => {
    router.back();
  };
  const handleValidate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    redirectToPreviousPage();
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClickCancel();
  };

  return (
    <div className="relative p-2 grid justify-items-center overflow-hidden ">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-6">
        Souhaitez-vous annuler la saisie du cahier de séance ?
      </h3>
      <div className="flex justify-center gap-6 w-full">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
          onClick={handleCancel}
          variant="red"
        >
          Non
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Oui
        </Button>
      </div>
    </div>
  );
};

export default RemoveCSeance;
