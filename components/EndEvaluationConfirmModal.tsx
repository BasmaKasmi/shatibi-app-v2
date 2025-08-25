"use client";

import { Modal } from "@mantine/core";
import Button from "./Button";
import Image from "next/image";
import validate from "@/public/validation.svg";

type EndEvaluationConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const EndEvaluationConfirmModal = ({
  opened,
  onClose,
  onConfirm,
}: EndEvaluationConfirmModalProps) => (
  <Modal
    centered
    opened={opened}
    onClose={onClose}
    withCloseButton={false}
    radius="lg"
  >
    {" "}
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h2 className="text-xl font-bold text-center">
        Êtes vous sur de vouloir mettre fin à l&apos;évaluation ?
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

export default EndEvaluationConfirmModal;
