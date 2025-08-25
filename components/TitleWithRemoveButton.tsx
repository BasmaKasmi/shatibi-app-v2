"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Modal } from "@mantine/core";
import RemoveCSeance from "./RemoveCSeance";
import Button from "./Button";

const TitleWithRemoveButton = ({ title }: { title: string }) => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

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
        className="h-8 w-26 flex items-center justify-center text-center"
        onClick={openModal}
        variant="red"
      >
        Fin
      </Button>

      <Modal
        opened={opened}
        onClose={closeModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <RemoveCSeance
          onValidate={() => console.log("Oui clicked")}
          onClickCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default TitleWithRemoveButton;
