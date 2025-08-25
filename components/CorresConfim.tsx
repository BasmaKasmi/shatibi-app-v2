"use client";

import React from "react";
import Image from "next/image";
import validate from "@/public/validation.svg";

interface CorresConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CorresConfirm = ({ onConfirm, onCancel }: CorresConfirmProps) => {
  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-4">
        Correspondance envoyé avec succès !
      </h3>
    </div>
  );
};

export default CorresConfirm;
