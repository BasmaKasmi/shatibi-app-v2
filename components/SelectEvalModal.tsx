import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";

interface SelectEvalModalProps {
  opened: boolean;
  onClose: () => void;
  studentName: string;
  onSelectType: (type: string) => void;
}

const evaluationTypes = [
  { id: "memorisation", label: "Suivi mémorisation" },
  { id: "revision", label: "Suivi révision" },
];

const SelectEvalModal = ({
  opened,
  onClose,
  studentName,
  onSelectType,
}: SelectEvalModalProps) => {
  const router = useRouter();

  const handleTypeClick = (type: string) => {
    if (type === "memorisation") {
      router.push(
        `/evaluation-memorisation?studentName=${encodeURIComponent(
          studentName
        )}`
      );
    } else if (type === "revision") {
      onSelectType(type);
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
          Choisir l&apos;évaluation
        </h2>
        <div className="flex flex-col gap-4">
          {evaluationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200 text-lg font-bold text-center"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SelectEvalModal;
