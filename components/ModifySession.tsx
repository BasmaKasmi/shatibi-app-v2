"use client";
import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/dates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidateEmargementPayload, validateFeuilleEmargement } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";

interface ModifySessionProps {
  onValidate: () => void;
  onCancel: () => void;
  groupId: number;
  date: string;
  studentList: Array<{
    student_id: number;
    absence: "PR" | "AP" | "AI" | "RJ" | "AE";
  }>;
}

const ModifySession = ({
  onValidate,
  onCancel,
  groupId,
  date,
  studentList,
}: ModifySessionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { teacherId } = useTeacher();
  const [isSendInfoModalOpen, setIsSendInfoModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    localStorage.getItem("startDate") || formatDate(new Date())
  );
  const [endDate, setEndDate] = useState<string>(
    localStorage.getItem("endDate") || ""
  );

  const search = useSearchParams();
  const groupName = search.get("groupName") || "";
  const groupSlot = search.get("groupSlot") || "";

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

  const redirectToCseancePage = () => {
    const encodedGroupName = encodeURIComponent(groupName);
    const encodedGroupSlot = encodeURIComponent(groupSlot);
    router.push(
      `/cahier-seances/c-seance-page?groupId=${groupId}&groupName=${encodedGroupName}&groupSlot=${encodedGroupSlot}&date=${date}`
    );
  };

  const redirectToPreviousPage = () => {
    router.back();
  };

  const handleValidate = () => {
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
    redirectToCseancePage();
    onValidate();
  };

  const handleCancel = () => {
    onValidate();
    redirectToPreviousPage();
  };

  return (
    <div className="relative p-2 grid justify-items-center overflow-hidden">
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center">
          <Image src={validate} alt="validation icon" width={50} height={50} />
        </div>
      </div>
      <h3 className="text-center text-lg font-semibold text-black my-2">
        Souhaitez-vous modifier le cahier de séance ?
      </h3>
      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={handleCancel}
          variant="red"
        >
          Non
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

export default ModifySession;
