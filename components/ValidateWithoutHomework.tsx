"use client";
import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { MouseEvent, useEffect, useState } from "react";
import { validateCahierSeance, ValidationPayloadWithFiles } from "@/api";
import { useRouter, useSearchParams } from "next/navigation";

interface CustomFile {
  name: string;
  base64: string;
  mime: string;
  file: File;
}

type ValidateWithoutHomeworkModalProps = {
  onValidate: (success: boolean) => void;
  onClickCancel: () => void;
  groupId: number;
  teacherId: number;
  studentId?: number;
  date: string;
  abstract: string;
  summaryFile?: CustomFile | null;
};

const ValidateWithoutHomework = ({
  onValidate,
  onClickCancel,
  groupId,
  teacherId,
  date,
  abstract,
  summaryFile,
}: ValidateWithoutHomeworkModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [origin, setOrigin] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const groupName = searchParams.get("groupName");
  const groupSlot = searchParams.get("groupSlot");

  useEffect(() => {
    const savedOrigin = localStorage.getItem("origin");
    setOrigin(savedOrigin);
  }, []);

  const redirectToPage = () => {
    if (origin?.includes("/emargement")) {
      router.push("/home");
    } else if (origin?.includes("/cahier-seances/groups-page")) {
      const url = `/cahier-seances/weeks-page?groupId=${groupId}&groupName=${groupName}&groupSlot=${groupSlot}&date=${date}`;
      router.push(url);
    } else {
      router.push("/home");
    }
  };

  const handleValidate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);
    setError(null);

    try {
      const payload: ValidationPayloadWithFiles = {
        group_id: groupId.toString(),
        teacher_id: teacherId,
        date: date,
        abstract: abstract,
        homework: "",
        ...(summaryFile && {
          abstract_file_name: summaryFile.name,
          abstract_file_mime: summaryFile.mime,
          abstract_file: summaryFile.base64,
        }),
      };

      const response = await validateCahierSeance(payload);

      if (response.status === "success") {
        onValidate(true);
        redirectToPage();
      } else {
        setError(
          response.error || "Une erreur est survenue lors de la validation."
        );
        onValidate(false);
      }
    } catch (err) {
      setError("Erreur de validation du cahier de séance.");
      onValidate(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClickCancel();
  };

  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-4">
        Vous êtes sur le point d&apos;envoyer le cahier de séance{" "}
        <span className="text-shatibi-red">sans travail à faire</span>
      </h3>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-center gap-6 w-full">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
          onClick={handleCancel}
          variant="red"
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Valider
        </Button>
      </div>
    </div>
  );
};

export default ValidateWithoutHomework;
