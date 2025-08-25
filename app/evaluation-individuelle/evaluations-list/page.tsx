"use client";
import { useSearchParams } from "next/navigation";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";
import EvaluationHeader from "@/components/EvaluationHeader";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import SelectEvalModal from "@/components/SelectEvalModal";
import StartRevisionModal from "@/components/StartRevisionModal";

const EvaluationsListPage = () => {
  const search = useSearchParams();
  const studentName = search.get("studentName");
  const [
    selectModalOpened,
    { open: openSelectModal, close: closeSelectModal },
  ] = useDisclosure(false);
  const [
    revisionModalOpened,
    { open: openRevisionModal, close: closeRevisionModal },
  ] = useDisclosure(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const statuses = [
    { id: "fill", label: "Tout" },
    { id: "coming", label: "Révision" },
    { id: "sent", label: "Mémorisation" },
  ];

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleEvalTypeSelect = (type: string) => {
    if (type === "revision") {
      closeSelectModal();
      openRevisionModal();
    }
  };

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <SelectEvalModal
        opened={selectModalOpened}
        onClose={closeSelectModal}
        studentName={studentName || ""}
        onSelectType={handleEvalTypeSelect}
      />

      <StartRevisionModal
        opened={revisionModalOpened}
        onClose={closeRevisionModal}
        studentName={studentName || ""}
      />

      <div className="px-6 py-4">
        <EvaluationHeader title="Liste des évaluations" />
      </div>

      {studentName && (
        <div>
          <h1 className="text-2xl font-bold text-center">{studentName}</h1>
        </div>
      )}

      <h2 className="text-xl font-semibold ml-5 mt-8">
        Liste des évaluations :
      </h2>

      <div className="mt-4 flex justify-center items-center text-xs">
        <span className="font-medium mr-1">Afficher :</span>
        <div className="flex items-center">
          {statuses.map((status) => (
            <label
              key={status.id}
              className="flex items-center ml-4 first:ml-0"
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.id)}
                onChange={() => handleStatusChange(status.id)}
                className="w-4 h-4 border-gray-300 rounded mr-1"
              />
              <span className="font-semibold">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto"></div>

      <div className="fixed bottom-12 left-0 right-0">
        <Button
          className="w-fit mx-auto mb-12 z-10"
          onClick={openSelectModal}
          variant="orange"
        >
          Ajouter une évaluation
        </Button>
      </div>

      <BottomMenu />
    </div>
  );
};

export default EvaluationsListPage;
