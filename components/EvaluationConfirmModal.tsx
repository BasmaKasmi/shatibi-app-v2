"use client";

import { Modal } from "@mantine/core";
import Button from "./Button";
import Image from "next/image";
import validate from "@/public/validation.svg";

type EvaluationConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const EvaluationConfirmModal = ({
  opened,
  onClose,
  onConfirm,
}: EvaluationConfirmModalProps) => (
  <Modal
    centered
    opened={opened}
    onClose={onClose}
    withCloseButton={false}
    radius="lg"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h2 className="text-xl font-bold text-center">
        Envoyer la note et l&apos;appréciation à l&apos;étudiant ?
      </h2>
      <div className="flex gap-4 w-full">
        <Button variant="red" onClick={onClose} className="flex-1">
          Retour
        </Button>
        <Button variant="green" onClick={onConfirm} className="flex-1">
          Valider
        </Button>
      </div>
    </div>
  </Modal>
);

export default EvaluationConfirmModal;
