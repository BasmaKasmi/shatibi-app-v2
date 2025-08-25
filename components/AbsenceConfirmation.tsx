import React from "react";
import validate from "@/public/validation.svg";
import Image from "next/image";
import Button from "./Button";

interface AbsenceConfirmationProps {
  onClose: () => void;
}

const AbsenceConfirmation = ({ onClose }: AbsenceConfirmationProps) => {
  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <div className="rounded-3xl bg-white">
        <div className="mb-2">
          <div className="flex justify-center items-center">
            <Image
              src={validate}
              alt="validation icon"
              width={50}
              height={50}
            />
          </div>
        </div>
        <h3 className="text-center text-lg font-semibold text-black my-2">
          Vos absences ont bien été prises en compte.
        </h3>
        <div className="flex justify-center">
          <Button
            className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
            variant="green"
            onClick={onClose}
          >
            Revenir sur l&apos;application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AbsenceConfirmation;
