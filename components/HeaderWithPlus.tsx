"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import plus from "@/public/assets/Plus.svg";
import { CdsWorkflow } from "./CdsWorkflow";
import { CorrespondanceWorkflow } from "./CorrespondenceWorkflow";

interface HeaderWithPlusProps {
  title: string;
}

const HeaderWithPlus = ({ title }: HeaderWithPlusProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCdsWorkflowOpen, setIsCdsWorkflowOpen] = useState(false);
  const [isCorrespondanceWorkflowOpen, setIsCorrespondanceWorkflowOpen] =
    useState(false);

  const getDefaultTabForCurrentPage = () => {
    console.log("Pathname actuel:", pathname);
    if (pathname?.includes("resume-weeks")) {
      return "resume";
    }
    if (pathname?.includes("weeks")) {
      return "devoir";
    }
    return "resume";
  };

  const getReturnUrl = () => {
    const params = searchParams.toString();
    const fullUrl = params ? `${pathname}?${params}` : pathname;
    console.log("URL de retour construite:", fullUrl);
    return fullUrl;
  };

  const isCorrespondenceMode = () => {
    return searchParams.get("correspondenceMode") !== null;
  };

  const handleBack = () => {
    router.back();
  };

  const handlePlusClick = () => {
    console.log("Bouton plus cliqué");

    if (isCorrespondenceMode()) {
      setIsCorrespondanceWorkflowOpen(true);
    } else {
      setIsCdsWorkflowOpen(true);
    }
  };

  const handleCloseCdsWorkflow = () => {
    setIsCdsWorkflowOpen(false);
  };

  const handleCloseCorrespondanceWorkflow = () => {
    setIsCorrespondanceWorkflowOpen(false);
  };

  return (
    <>
      <div className="w-full flex items-center relative">
        <button onClick={handleBack} className="absolute left-0">
          <Image
            src="/assets/eval-annuelle.svg"
            alt="Retour"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </button>
        <h1 className="w-full text-xl font-bold text-center">{title}</h1>
        <button onClick={handlePlusClick} className="absolute right-0">
          <Image
            src={plus}
            alt="Ajouter"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </button>
      </div>

      {isCorrespondenceMode() ? (
        <CorrespondanceWorkflow
          isOpen={isCorrespondanceWorkflowOpen}
          onClose={handleCloseCorrespondanceWorkflow}
        />
      ) : (
        <CdsWorkflow
          isOpen={isCdsWorkflowOpen}
          onClose={handleCloseCdsWorkflow}
          defaultTab={getDefaultTabForCurrentPage()}
          returnUrl={getReturnUrl()}
        />
      )}
    </>
  );
};

export default HeaderWithPlus;
