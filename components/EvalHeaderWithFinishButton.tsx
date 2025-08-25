"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useState } from "react";
import EndEvaluationConfirmModal from "./EndEvaluationConfirmModal";

interface EvalHeaderWithFinishButtonProps {
  title: string;
}

const EvalHeaderWithFinishButton = ({
  title,
}: EvalHeaderWithFinishButtonProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <button onClick={() => router.back()} className="w-10 h-10 flex-shrink-0">
        <Image
          src="/assets/eval-annuelle.svg"
          alt="Retour"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </button>
      <h1 className="text-xl font-bold text-center truncate flex-1 whitespace-nowrap">
        {title}
      </h1>
      <Button
        variant="red"
        onClick={() => setIsModalOpen(true)}
        className="py-1 px-4 font-bold bg-red-100 flex-shrink-0"
      >
        Fin
      </Button>
      <EndEvaluationConfirmModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          router.back();
        }}
      />
    </div>
  );
};

export default EvalHeaderWithFinishButton;
