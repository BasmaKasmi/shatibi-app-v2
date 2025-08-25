"use client";

import { Modal } from "@mantine/core";
import Button from "@/components/Button";

interface EvalAppreciationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appreciation: string;
  setAppreciation: (value: string) => void;
  onConfirm: () => void;
}

const EvalAppreciationModal = ({
  isOpen,
  onClose,
  appreciation,
  setAppreciation,
  onConfirm,
}: EvalAppreciationModalProps) => {
  return (
    <Modal
      centered
      opened={isOpen}
      withCloseButton={false}
      radius="lg"
      onClose={onClose}
    >
      <div className="relative p-2 flex flex-col items-center">
        <h3 className="text-md font-semibold text-black my-2 self-start">
          Ajouter une appreciation
        </h3>
        <textarea
          className="form-textarea mt-1 block w-full rounded-lg border border-gray-300 shadow-md px-4 py-4"
          rows={6}
          value={appreciation}
          onChange={(e) => setAppreciation(e.target.value)}
        />
        <div className="flex justify-center gap-6 w-full mt-4">
          <Button
            className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
            onClick={onClose}
            variant="red"
          >
            Retour
          </Button>
          <Button
            className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
            onClick={onConfirm}
            variant="green"
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EvalAppreciationModal;
