"use client";
import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { useState, MouseEvent } from "react";
import { formatDate } from "@/lib/dates";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidateEmargementPayload, validateFeuilleEmargement } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";

type SendInfoToStudentsModalProps = {
  onValidate: () => void;
  onClickCancel: () => void;
  groupId: number;
  date: string;
  studentList: Array<{
    student_id: number;
    absence: "PR" | "AP" | "AI" | "RJ" | "AE";
  }>;
};

const SendInfoToStudents = ({
  onValidate,
  onClickCancel,
  groupId,
  date,
  studentList,
}: SendInfoToStudentsModalProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { teacherId } = useTeacher();
  const [startDate, setStartDate] = useState<string>(
    localStorage.getItem("startDate") || formatDate(new Date())
  );
  const [endDate, setEndDate] = useState<string>(
    localStorage.getItem("endDate") || ""
  );

  const { mutate: validateFeuille } = useMutation({
    mutationFn: () => {
      if (teacherId === null) {
        throw new Error("L'ID de l'enseignant n'est pas disponible.");
      }
      const payload: ValidateEmargementPayload = {
        teacher_id: teacherId,
        group_id: groupId,
        date: date,
        student_list: studentList,
      };

      return validateFeuilleEmargement(payload);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EMARGEMENT_NON_FAIT],
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAST_PRESENCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NEXT_COURSE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ATTENDANCE_LIST] });
    },
  });

  const redirectToPreviousPage = () => {
    router.back();
  };

  const handleValidate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);

    onValidate();
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onValidate();
    redirectToPreviousPage();
  };

  return (
    <div className="relative p-2 grid justify-items-center">
      <div className="flex justify-center items-center">
        <Image src={validate} alt="validation icon" width={50} height={50} />
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-6">
        Votre feuille d&apos;émargement a bien été validée. <br />
        Souhaitez-vous saisir le cahier de séance ?
      </h3>
      <div className="flex justify-center gap-6 w-full">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 rounded-full"
          onClick={handleCancel}
          variant="red"
        >
          Non, plus tard
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Oui
        </Button>
      </div>
    </div>
  );
};

export default SendInfoToStudents;
