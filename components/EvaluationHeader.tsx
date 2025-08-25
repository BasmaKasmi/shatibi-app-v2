"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EvaluationHeaderProps {
  title: string;
  onBackClick?: () => void;
}

const EvaluationHeader = ({ title, onBackClick }: EvaluationHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
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
    </div>
  );
};

export default EvaluationHeader;
