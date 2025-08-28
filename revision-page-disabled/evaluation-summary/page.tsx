"use client";
import Button from "@/components/Button";
import EvaluationHeader from "@/components/EvaluationHeader";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import EvaluationConfirmModal from "@/components/EvaluationConfirmModal";

interface EvalScore {
  pageNumber: number;
  score: number;
}

interface EvalSummaryProps {
  scores: EvalScore[];
  totalScore: number;
}

const EvalSummary = () => {
  const searchParams = useSearchParams();
  const scores = JSON.parse(searchParams.get("scores") || "[]");
  const totalScore = parseInt(searchParams.get("total") || "0");
  const startPage = scores[0]?.pageNumber;
  const endPage = scores[scores.length - 1]?.pageNumber;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col">
      <div className="px-6 py-4">
        <EvaluationHeader title="Récapitulatif de l'éval." />
        <div className="text-center mt-2">
          <p className="text-sm text-black">
            Evalué sur de la page {startPage} à {endPage}
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 space-y-4"></div>

      <div className="p-6 bg-white space-y-6">
        <div className="space-y-2">
          <p className="text-gray-500 text-center">Note globale</p>
        </div>
        <Button
          className="w-full"
          variant="green"
          onClick={() => setIsModalOpen(true)}
        >
          Valider la saisie de l&apos;évaluation
        </Button>
      </div>
      <EvaluationConfirmModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default EvalSummary;
