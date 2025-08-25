import { Modal } from "@mantine/core";
import { useState, useCallback } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

interface RevisionParams {
  startPage: string;
  endPage: string;
  questionCount: number;
}

interface StartRevisionModalProps {
  opened: boolean;
  onClose: () => void;
  studentName: string;
  onStart?: (params: RevisionParams) => void;
  minQuestions?: number;
  maxQuestions?: number;
  defaultStartPage?: string;
}

const StartRevisionModal = ({
  opened,
  onClose,
  onStart,
  minQuestions = 1,
  maxQuestions = 20,
  defaultStartPage = "158",
}: StartRevisionModalProps) => {
  const router = useRouter();
  const [startPage, setStartPage] = useState(defaultStartPage);
  const [endPage, setEndPage] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const validatePageNumber = (value: string): boolean => {
    const pageNum = parseInt(value);
    return !isNaN(pageNum) && pageNum > 0 && pageNum <= 604;
  };

  const handlePageChange = useCallback((value: string, isStart: boolean) => {
    const setValue = isStart ? setStartPage : setEndPage;
    setValue(value);
    setError(null);
  }, []);

  const handleQuestionCountChange = useCallback(
    (increment: number) => {
      setQuestionCount((prev) => {
        const newValue = prev + increment;
        return Math.min(Math.max(newValue, minQuestions), maxQuestions);
      });
    },
    [minQuestions, maxQuestions]
  );

  const validateAndStart = useCallback(() => {
    setError(null);

    if (!validatePageNumber(startPage)) {
      setError("La page de début doit être un nombre valide (1-604)");
      return;
    }

    if (!validatePageNumber(endPage)) {
      setError("La page de fin doit être un nombre valide (1-604)");
      return;
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);
    if (end <= start) {
      setError("La page de fin doit être supérieure à la page de début");
      return;
    }

    router.push(`/revision-page/${startPage}/${endPage}/${questionCount}`);
  }, [startPage, endPage, questionCount, router]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      radius="xl"
      centered
      withCloseButton={false}
      size={340}
      classNames={{
        content: "bg-white rounded-3xl p-6",
        inner: "px-4",
      }}
    >
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl font-bold text-center">Révision Coran</h2>

        <div className="flex items-center gap-2">
          <span className="text-s font-bold">Indiquer les</span>
          <div className="bg-gray-50 rounded-2xl px-3 py-1.5 flex items-center gap-1">
            <span className="text-s">Page</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
          <input
            type="text"
            value={startPage}
            onChange={(e) => handlePageChange(e.target.value, true)}
            className="w-12 py-1 text-center text-lg border-b border-gray-300"
            maxLength={3}
            pattern="\d*"
            aria-label="Page de début"
          />
          <span className="text-xs">à</span>
          <input
            type="text"
            value={endPage}
            onChange={(e) => handlePageChange(e.target.value, false)}
            className="w-12 py-1 text-center text-lg border-b border-gray-300"
            maxLength={3}
            pattern="\d*"
            aria-label="Page de fin"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-s font-bold">Nombre de questions :</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuestionCountChange(-1)}
              className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xl"
              aria-label="Diminuer le nombre de questions"
            >
              -
            </button>
            <span className="text-xl w-4 text-center">{questionCount}</span>
            <button
              onClick={() => handleQuestionCountChange(1)}
              className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xl"
              aria-label="Augmenter le nombre de questions"
            >
              +
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center -mt-4">{error}</p>
        )}

        <div className="flex justify-center gap-6 w-full">
          <Button
            className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
            onClick={onClose}
            variant="red"
          >
            Annuler
          </Button>
          <Button
            className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
            onClick={validateAndStart}
            variant="green"
          >
            Commencer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StartRevisionModal;
