"use client";
import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { MouseEvent } from "react";

type AddHomeworkModalProps = {
  onValidate: () => void;
  onClickCancel: () => void;
};

const AddHomework = ({ onValidate, onClickCancel }: AddHomeworkModalProps) => {
  const handleValidate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onValidate();
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClickCancel();
  };

  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-2">
        Souhaitez-vous ajouter un travail à faire ?
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

export default AddHomework;
