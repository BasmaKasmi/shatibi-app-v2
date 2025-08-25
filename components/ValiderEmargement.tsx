"use client";

import Image from "next/image";
import validate from "@/public/validation.svg";
import Button from "./Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidateEmargementPayload, validateFeuilleEmargement } from "@/api";
import {
  getWorkbookList,
  WorkbookListApiResponse,
  getGroups,
  Group,
} from "@/api";
import SendInfoToStudents from "./SendInfoToStudents";
import { Modal } from "@mantine/core";
import { useTeacher } from "@/app/TeacherContext";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";
import { useDate } from "@/app/DateContext";
import ModifySession from "./ModifySession";
import ClassWork from "./Classwork";

const ApOrAiButton = ({ motive }: { motive: "AP" | "AI" }) => {
  const ApOrAiClasses =
    "w-8 h-8 rounded-full text-center font-bold shadow-lg flex items-center justify-center bg-shatibi-red text-white";

  return <div className={ApOrAiClasses}>{motive}</div>;
};

type Student = {
  id: number;
  name: string;
  absent: boolean;
  motive: string | null;
};

interface ValiderEmargementProps {
  onValidate: () => void;
  onCancel: () => void;
  students: Student[];
  Absentstudents: Student[];
}
const ValiderEmargement = ({
  onValidate,
  onCancel,
  students,
}: ValiderEmargementProps) => {
  const router = useRouter();
  const { startDate, setStartDate, endDate, setEndDate } = useDate();
  const [isValiderModalOpen, setIsValiderModalOpen] = useState(true);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isWorkbookRequired, setIsWorkbookRequired] = useState(false);

  const search = useSearchParams();
  const workbookId = Number(search.get("workbookId")) || undefined;
  const queryClient = useQueryClient();
  const groupId = Number(search.get("groupId"));
  const date = search.get("date") || "";
  const groupName = search.get("groupName") || "";
  const groupSlot = search.get("groupSlot") || "";
  const { teacherId, setTeacherId } = useTeacher();
  const [isClassWorkModalOpen, setIsClassWorkModalOpen] = useState(false);
  const presentCount = students.filter((student) => !student.absent).length;
  const absentCount = students.filter((student) => student.absent).length;
  const [formattedStudentList, setFormattedStudentList] = useState<
    Array<{
      student_id: number;
      absence: "PR" | "AP" | "AI" | "RJ" | "AE";
    }>
  >([]);

  const { mutate: validateFeuille, isPending: isValidating } = useMutation({
    mutationFn: () => {
      if (teacherId === null) {
        throw new Error("L'ID de l'enseignant n'est pas disponible.");
      }
      const payload: ValidateEmargementPayload = {
        teacher_id: teacherId,
        group_id: groupId,
        date: date,
        student_list: formattedStudentList,
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

  const {
    data: workbookList,
    isLoading,
    isError,
    error,
  } = useQuery<WorkbookListApiResponse, Error>({
    queryKey: [QUERY_KEY.WORKBOOK_LIST, groupId, startDate, endDate, teacherId],
    queryFn: () => {
      if (teacherId === null || groupId === null) {
        throw new Error("Teacher ID or Group ID is not available.");
      }
      return getWorkbookList(groupId, teacherId, startDate, endDate);
    },
    enabled: !!groupId && !!teacherId && !!startDate && !!endDate,
    retry: false,
  });

  const {
    data: groupList,
    isLoading: isGroupLoading,
    isError: isGroupError,
  } = useQuery({
    queryKey: [QUERY_KEY.GROUPS, teacherId],
    queryFn: () => {
      if (teacherId === null) {
        throw new Error("Teacher ID is null");
      }
      return getGroups(teacherId);
    },
    enabled: !!teacherId,
  });

  const handleValidateClick = () => {
    const studentListForApi = students.map((student) => ({
      student_id: student.id,
      absence: (student.motive || "PR") as "PR" | "AP" | "AI" | "RJ" | "AE",
    }));

    setFormattedStudentList(studentListForApi);

    validateFeuille();

    const currentWorkbook = workbookList?.result.find(
      (workbook) => workbook.date === date
    );

    if (currentWorkbook && currentWorkbook.validate) {
      setIsValidated(true);
    } else {
      setIsValidated(false);
    }

    const currentGroup = groupList?.find(
      (group: Group) => group.id === groupId
    );

    if (currentGroup && !currentGroup.workbook_required) {
      onValidate();
      router.back();
      return;
    }

    setIsWorkbookRequired(true);
    setIsValiderModalOpen(false);
    setIsResultModalOpen(true);
  };

  const redirectToCseancePage = () => {
    onValidate();
    const encodedGroupName = encodeURIComponent(groupName);
    const encodedGroupSlot = encodeURIComponent(groupSlot);
    const baseUrl = `/cahier-seances/c-seance-page?groupId=${groupId}&groupName=${encodedGroupName}&groupSlot=${encodedGroupSlot}&date=${date}`;
    const urlWithWorkbook = workbookId
      ? `${baseUrl}&workbookId=${workbookId}`
      : baseUrl;
    router.push(urlWithWorkbook);
  };

  const openClassWorkModal = () => {
    setIsResultModalOpen(false);
    setIsClassWorkModalOpen(true);
  };

  const handleClassWorkComplete = () => {
    setIsClassWorkModalOpen(false);
    onValidate();
    router.back();
  };

  const handleCancel = () => {
    setIsValiderModalOpen(false);
    onCancel();
  };

  const absentStudentsList = students.filter((student) => student.absent);

  return (
    <div className="relative p-2 grid justify-items-center overflow-hidden">
      <Modal
        opened={isValiderModalOpen}
        onClose={handleCancel}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <div className="flex justify-center items-center">
          <Image src={validate} alt="validation icon" width={50} height={50} />
        </div>
        <h3 className="text-center text-lg font-semibold text-black my-2">
          Vous déclarez avoir :
        </h3>
        <div className="text-center">
          <p>
            <span className="font-semibold">{presentCount}</span> Présents et{" "}
            <span className="font-semibold">{absentCount}</span> Absents
          </p>
        </div>
        <div className="overflow-auto max-h-96 w-full text-center px-4 py-2">
          {absentStudentsList.map((student: Student) => (
            <div
              key={student.id}
              className="bg-white flex justify-between items-center px-4 py-2 rounded-lg shadow-md mt-2"
            >
              <p className="font-semibold text-sm truncate"> {student.name}</p>
              {student.motive && (
                <ApOrAiButton motive={student.motive as "AP" | "AI"} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 w-full mt-4">
          <Button
            className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
            onClick={handleCancel}
            variant="red"
          >
            Annuler
          </Button>
          <Button
            className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
            onClick={handleValidateClick}
            variant="green"
          >
            Valider
          </Button>
        </div>
      </Modal>

      <Modal
        opened={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        withCloseButton={false}
        radius="lg"
        centered
      >
        {isLoading || isGroupLoading ? (
          <p>Chargement...</p>
        ) : isError || isGroupError ? (
          <p>Erreur lors du chargement des données</p>
        ) : (
          <>
            {isValidated ? (
              <ModifySession
                onValidate={redirectToCseancePage}
                onCancel={() => setIsResultModalOpen(false)}
                groupId={groupId}
                date={date}
                studentList={formattedStudentList}
              />
            ) : isWorkbookRequired ? (
              <SendInfoToStudents
                onValidate={openClassWorkModal}
                onClickCancel={() => {
                  setIsResultModalOpen(false);
                  router.back();
                }}
                groupId={groupId}
                date={date}
                studentList={formattedStudentList}
              />
            ) : null}
          </>
        )}
      </Modal>
      <Modal
        opened={isClassWorkModalOpen}
        onClose={() => setIsClassWorkModalOpen(false)}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <ClassWork
          name={groupName}
          groupId={groupId}
          teacherId={teacherId || 0}
          studentId={0}
          date={date}
          workbookId={workbookId}
          onComplete={handleClassWorkComplete}
        />
      </Modal>
    </div>
  );
};

export default ValiderEmargement;
