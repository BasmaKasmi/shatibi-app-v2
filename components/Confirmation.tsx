"use client";

import React from "react";
import Button from "@/components/Button";
import Image from "next/image";
import validate from "@/public/validation.svg";

interface ConfirmationContentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationContent = ({
  onConfirm,
  onCancel,
}: ConfirmationContentProps) => {
  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-4">
        Confirmez-vous l&apos;envoi du correspondance ?
      </h3>
      <div className="flex justify-center gap-6 w-full">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
          onClick={onCancel}
          variant="red"
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={onConfirm}
          variant="green"
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationContent;
