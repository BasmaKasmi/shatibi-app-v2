"use client";

import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { validateCahierSeance, ValidationPayloadWithFiles } from "@/api/index";
import { ValidationResponse } from "@/api/index";
import { useEffect, useState } from "react";
import { QUERY_KEY } from "@/lib/queries";

interface CahierSeanceModalProps {
  onClickValidate: () => void;
  onClickCancel: () => void;
  group_id: number;
  teacher_id: number;
  date: string;
  abstract: string;
  homework: string;
  abstract_file: CustomFile | null;
  homework_file: CustomFile | null;
  group_name: string;
  group_slot: string;
}

interface CustomFile {
  name: string;
  base64: string;
  mime: string;
  file: File;
}

const CahierSeanceModal = ({
  onClickValidate,
  onClickCancel,
  group_id,
  teacher_id,
  date,
  abstract,
  homework,
  homework_file,
  abstract_file,
  group_name,
  group_slot,
}: CahierSeanceModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const groupId = searchParams.get("groupId");
  const groupName = searchParams.get("groupName");
  const groupSlot = searchParams.get("groupSlot");
  const courseDate = searchParams.get("date");

  useEffect(() => {
    const savedOrigin = localStorage.getItem("origin");
    console.log("Origine récupérée :", savedOrigin);
    setOrigin(savedOrigin);
  }, []);

  const mutation = useMutation<
    ValidationResponse,
    Error,
    ValidationPayloadWithFiles
  >({
    mutationFn: (payload) => validateCahierSeance(payload),
    onSuccess: (data) => {
      if (data.status === "success") {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.WORKBOOK_LIST],
        });
        onClickValidate();
      } else {
        console.error("Erreur:", data.error);
      }
    },
    onError: (error) => {
      console.error("Échec de la requête API :", error.message);
    },
  });

  const redirectToPage = () => {
    console.log("Origine récupérée dans redirectToPage :", origin);

    if (origin && origin.includes("/emargement")) {
      console.log("Redirection vers /home depuis /emargement");
      router.push("/home");
    } else if (origin && origin.includes("/cahier-seances/groups-page")) {
      console.log("Redirection vers /cahier-seances/weeks-page");
      const url = `/cahier-seances/weeks-page?groupId=${groupId}&groupName=${groupName}&groupSlot=${groupSlot}&date=${courseDate}`;
      router.push(url);
    } else {
      console.log("Redirection par défaut vers /home");
      router.push("/home");
    }
  };

  const handleValidate = async () => {
    const storedAbstract =
      localStorage.getItem(`abstract_${teacher_id}_${date}`) || abstract;
    const storedHomework =
      localStorage.getItem(`homework_${teacher_id}_${date}`) || homework;

    const payload: ValidationPayloadWithFiles = {
      group_id: group_id.toString(),
      teacher_id: teacher_id,
      date: date,
      abstract: storedAbstract || "NA",
      homework: storedHomework || "NA",
      abstract_file_name: abstract_file?.name,
      abstract_file_mime: abstract_file?.mime,
      abstract_file: abstract_file ? abstract_file.base64 : undefined,
      homework_file_name: homework_file?.name,
      homework_file_mime: homework_file?.mime,
      homework_file: homework_file ? homework_file.base64 : undefined,
    };

    redirectToPage();
    mutation.mutate(payload);
  };

  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <Image src={validate} alt="validation icon" width={50} height={50} />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-2">
        Vous êtes sur le point d’envoyer le cahier de séance à tous les
        étudiants
      </h3>

      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={onClickCancel}
          variant="red"
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
};

export default CahierSeanceModal;
