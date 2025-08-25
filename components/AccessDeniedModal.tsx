"use client";
import Button from "./Button";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

type AccessDeniedModalProps = {
  onValidate: () => void;
  onClickCancel: () => void;
};

const AccessDeniedModal = ({ onClickCancel }: AccessDeniedModalProps) => {
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
      <h3 className="text-center text-lg font-semibold text-black my-6">
        Vous n&apos;avez pas l&apos;autorisation d&apos;accéder à votre espace
        étudiant
      </h3>
      <div className="flex justify-center gap-6 w-full">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
          onClick={handleCancel}
          variant="red"
        >
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedModal;
