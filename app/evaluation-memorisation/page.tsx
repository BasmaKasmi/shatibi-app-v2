"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import EvaluationHeader from "@/components/EvaluationHeader";
import Button from "@/components/Button";
import { Select } from "@mantine/core";
import { useState } from "react";
import MemorizationEvalForm from "@/components/MemorizationEvalForm";
import EvaluationConfirmModal from "@/components/EvaluationConfirmModal";

const RangeInputs = () => (
  <div className="flex items-center gap-1">
    <input
      type="text"
      className="w-14 py-1 border-b border-gray-300 text-xs text-gray-600 bg-transparent focus:outline-none"
    />
    <span className="text-gray-400 text-xs">à</span>
    <input
      type="text"
      className="w-14 py-1 border-b border-gray-300 text-xs text-gray-600 bg-transparent focus:outline-none"
    />
  </div>
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-4 shadow-md">
    <div className="space-y-6">{children}</div>
  </div>
);

const Divider = () => (
  <div className="flex items-center justify-center gap-4 px-16">
    <div className="w-32 h-[0.06rem] bg-gray-300" />
    <span className="text-gray-400 text-xs">ou</span>
    <div className="w-32 h-[0.06rem] bg-gray-300" />
  </div>
);

const EvaluationMemorisationPage = () => {
  const search = useSearchParams();
  const router = useRouter();
  const studentName = search.get("studentName");
  const [evaluateEntireSourate, setEvaluateEntireSourate] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const handleConfirmEvaluation = () => {
    setShowEvalModal(false);
    router.back();
  };

  return (
    <div className="h-dvh flex flex-col">
      <div className="px-6 py-4">
        <EvaluationHeader title="Mémorisation" />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {studentName && (
          <h1 className="text-2xl font-bold text-center mb-6">{studentName}</h1>
        )}

        <div className="flex flex-col font-bold gap-6">
          <SectionCard>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">
                Sélectionner une Sourate :
              </span>
              <Select
                defaultValue="Al-Qiyamah"
                data={["Al-Qiyamah"]}
                classNames={{ input: "rounded-2xl" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">
                Indiquer les Versets :
              </span>
              <RangeInputs />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={evaluateEntireSourate}
                onChange={(e) => setEvaluateEntireSourate(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-gray-400 text-xs">
                Cochez si vous évaluez la sourate entière
              </span>
            </label>
          </SectionCard>

          <Divider />

          <SectionCard>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">
                Sélectionner les pages :
              </span>
              <RangeInputs />
            </div>
          </SectionCard>

          <MemorizationEvalForm />
        </div>
      </div>

      <div className="p-4 bg-white mt-auto">
        <Button
          className="w-full"
          variant="green"
          onClick={() => setShowEvalModal(true)}
        >
          Valider la saisie de l&apos;évaluation
        </Button>
      </div>
      <EvaluationConfirmModal
        opened={showEvalModal}
        onClose={() => setShowEvalModal(false)}
        onConfirm={handleConfirmEvaluation}
      />
    </div>
  );
};

export default EvaluationMemorisationPage;
