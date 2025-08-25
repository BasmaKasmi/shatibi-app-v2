"use client";

import Image from "next/image";
import { Modal } from "@mantine/core";
import { useRouter } from "next/navigation";
import GroupRecap from "./GroupRecap";
import { useState } from "react";

interface HeaderWithRecapButtonProps {
  title: string;
  groupRecap: {
    inscrits: number;
    abandons: number;
    presence: number;
    session: string;
  };
}

const HeaderWithRecapButton = ({
  title,
  groupRecap,
}: HeaderWithRecapButtonProps) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-full flex items-center justify-between px-6 relative">
      <div className="absolute -left-6">
        <button onClick={() => router.back()} aria-label="Retour">
          <Image
            src="/assets/eval-annuelle.svg"
            alt="Retour"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </button>
      </div>
      <h1 className="w-full text-xl font-bold text-center">{title}</h1>
      <div className="absolute -right-6">
        <button onClick={() => setOpened(true)} aria-label="Récapitulatif">
          <Image
            src="/assets/recap-button.svg"
            alt="Récapitulatif"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </button>
      </div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="md"
        radius="lg"
        withCloseButton={false}
        centered={false}
        styles={{
          content: { marginTop: "4rem" },
        }}
      >
        <GroupRecap groupRecap={groupRecap} />
      </Modal>
    </div>
  );
};

export default HeaderWithRecapButton;
