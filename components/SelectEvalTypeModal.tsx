"use client";
import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";

interface SelectEvalTypeModalProps {
  opened: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
  onOpenCollectiveModal: () => void;
}

const evaluationTypes = [
  { id: "collective", label: "Évaluation collective" },
  { id: "individuelle", label: "Évaluation individuelle" },
];

const SelectEvalTypeModal = ({
  opened,
  onClose,
  onOpenCollectiveModal,
}: SelectEvalTypeModalProps) => {
  const router = useRouter();

  const handleTypeClick = (type: string) => {
    if (type === "collective") {
      onClose();
      onOpenCollectiveModal();
    } else if (type === "individuelle") {
      router.push("/evaluation-individuelle/groups-page");
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      radius="lg"
      centered
      withCloseButton={false}
      classNames={{
        content: "bg-white rounded-3xl p-6",
      }}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">
          Type de l&apos;évaluation
        </h2>
        <div className="flex flex-col gap-4">
          {evaluationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200 text-lg font-bold text-center hover:bg-gray-50"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SelectEvalTypeModal;
