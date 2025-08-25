"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import EvalHeaderWithFinishButton from "./EvalHeaderWithFinishButton";
import clsx from "clsx";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface RevisionPageProps {
  startPage: string;
  endPage: string;
  questionCount: number;
}

interface Criterion {
  id: string;
  label: string;
  points: number;
  value: number;
}
interface EvalScore {
  pageNumber: number;
  score: number;
}

const RevisionPage = ({
  startPage,
  endPage,
  questionCount = 5,
}: RevisionPageProps): JSX.Element => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState("");
  const [evaluations, setEvaluations] = useState<EvalScore[]>([]);
  const [isNonAcquis, setIsNonAcquis] = useState(false);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "words", label: "Mots ou oubli", points: 2, value: 2 },
    { id: "vowels", label: "Voyelles", points: 1, value: 3 },
    { id: "hesitation", label: "Hésitation", points: 0.5, value: 1 },
    { id: "tajwid", label: "Tajwid", points: 0.25, value: 1 },
  ]);

  const calculateQuestionScore = useCallback(() => {
    const totalPoints = criteria.reduce(
      (total, criterion) => total + criterion.points * criterion.value,
      0
    );
    return Math.min(totalPoints, 20);
  }, [criteria]);

  const handleNextQuestion = useCallback(() => {
    const score = calculateQuestionScore();
    setEvaluations((prev) => [
      ...prev,
      {
        pageNumber: parseInt(pageNumber),
        score: score,
      },
    ]);

    if (currentQuestion < questionCount) {
      setCurrentQuestion((prev) => prev + 1);
      setPageNumber("");
      setIsNonAcquis(false);
      setCriteria((prevCriteria) =>
        prevCriteria.map((criterion) => ({
          ...criterion,
          value:
            criterion.id === "words" ? 2 : criterion.id === "vowels" ? 3 : 1,
        }))
      );
    }
  }, [currentQuestion, questionCount, pageNumber, calculateQuestionScore]);

  const handleCriterionChange = (criterionId: string, increment: boolean) => {
    setCriteria((prevCriteria) =>
      prevCriteria.map((criterion) =>
        criterion.id === criterionId
          ? {
              ...criterion,
              value: increment
                ? criterion.value + 1
                : Math.max(0, criterion.value - 1),
            }
          : criterion
      )
    );
  };

  const PaginationButton = ({ number }: { number: number | string }) => (
    <button
      className={clsx(
        "w-8 h-8 rounded-full border border-gray-300",
        typeof number === "number" && currentQuestion === number
          ? "bg-shatibi-blue/[.15]"
          : "bg-white"
      )}
    >
      {number}
    </button>
  );

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden md:hidden">
      <EvalHeaderWithFinishButton title="Révision Coran" />
      <div className="text-center mt-2">
        <p className="text-sm text-black">
          Evalué sur de la page {startPage} à {endPage}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <PaginationButton key={i} number={i + 1} />
        ))}
        <PaginationButton number="+" />
      </div>
      <div className="px-4 mt-4 max-w-2xl mx-auto w-full flex-1 overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow-md p-4">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-1">
            <div className="bg-shatibi-blue/[.15] text-shatibi-blue px-8 py-1.5 rounded-b-2xl text-base font-bold whitespace-nowrap">
              Question n°{currentQuestion}
            </div>
          </div>
          <div className="absolute -top-3 -right-3">
            <button className="p-3 rounded-lg">
              <Image
                src="/assets/trash.svg"
                alt="Supprimer"
                width={33}
                height={33}
              />
            </button>
          </div>
          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-bold">Page :</span>
              <input
                type="text"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="border border-gray-300 rounded w-14 px-2 py-1 text-sm"
              />
            </div>
            <div className="text-xl font-bold">note</div>
          </div>

          <div className="mt-6 space-y-2">
            {criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center justify-between"
              >
                <span className="text-black font-bold">
                  {criterion.label} - {criterion.points}pt
                  {criterion.points !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCriterionChange(criterion.id, false)}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold">
                    {criterion.value}
                  </span>
                  <button
                    onClick={() => handleCriterionChange(criterion.id, true)}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isNonAcquis}
              onChange={(e) => setIsNonAcquis(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label className="text-gray-500 text-sm font-bold">
              Cochez si le passage est non acquis
            </label>
          </div>
        </div>
        <div className="mt-6">
          <div className="relative rounded-lg shadow-md p-4 border">
            <h3 className="absolute -top-3 left-4 bg-white px-2 text-md font-medium">
              Commentaire
            </h3>
            <textarea
              className="w-full border-0 p-0 h-20 text-sm resize-none"
              placeholder=""
            />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white mt-auto">
        {currentQuestion < questionCount ? (
          <Button
            className="w-full"
            variant="orange"
            onClick={handleNextQuestion}
          >
            Passer à la question suivante
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="green"
            onClick={() => {
              const finalScore = calculateQuestionScore();
              const finalEvaluations = [
                ...evaluations,
                {
                  pageNumber: parseInt(pageNumber),
                  score: finalScore,
                },
              ];
              const totalScore = Math.round(
                finalEvaluations.reduce(
                  (sum, evaluation) => sum + evaluation.score,
                  0
                ) * 5
              );
              router.push(
                `/revision-page/evaluation-summary?scores=${JSON.stringify(
                  finalEvaluations
                )}&total=${totalScore}`
              );
            }}
          >
            Voir les résultats de l&apos;évaluation
          </Button>
        )}
      </div>
    </div>
  );
};

export default RevisionPage;
