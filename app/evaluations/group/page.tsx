"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useSearchParams } from "next/navigation";
import { formatSlotWithDayAndTime } from "@/lib/dates";
import useGroup from "@/hooks/useGroup";
import { Student } from "@/components/FeuilleEmargement";
import EvalStudentItem from "@/components/EvalStudentItem";
import Image from "next/image";
import studentsNumber from "@/public/students-number.svg";
import { useState } from "react";
import CollectiveAssessmentForm from "@/components/CollectiveAssessmentForm";
import { Modal } from "@mantine/core";
import EvaluationHeader from "@/components/EvaluationHeader";

const EvaluationsPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const [modalToDisplay, setModalToDisplay] = useState<String>("");
  const { allStudents } = useGroup({
    date: "",
    groupId,
  });

  const onClickCancel = () => {
    setModalToDisplay("");
  };

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Feuille d'évaluation" />
      </div>
      {groupName && groupSlot && (
        <div>
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <div className="flex ml-8">
        <Image
          src={studentsNumber}
          alt="nombre d'étudiants"
          width={17}
          height={17}
        />
        <h1 className="text-[14px] font-semibold ml-2">
          Nombre d&apos;étudiants: {allStudents.length}
        </h1>
      </div>
      <div className="flex flex-col gap-2 p-5 min-h-[33%] max-h-[83%] grow overflow-y-auto mb-20">
        {allStudents.map((student: Student) => (
          <EvalStudentItem student={student} key={student.id} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <Button
          className="w-fit mx-auto mb-5 z-10"
          onClick={() => setModalToDisplay("CreateCollectiveAssessment")}
          variant="orange"
        >
          Créer une évaluation collective
        </Button>
      </div>
      <Modal
        centered
        opened={modalToDisplay === "CreateCollectiveAssessment"}
        withCloseButton={false}
        radius="lg"
        onClose={() => {}}
      >
        <CollectiveAssessmentForm onClickCancel={onClickCancel} />
      </Modal>
    </div>
  );
};

export default EvaluationsPage;
