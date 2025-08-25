"use client";

import { useState } from "react";
import ConfirmAp from "@/components/ConfirmAp";
import { useList } from "react-use";
import { StudentDates } from "@/components/StudentDates";

export const StudentItem = ({ totalAbsences, name, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-row shadow-md rounded-lg justify-between p-3"
    >
      <div className="ml-5">
        <p className="text-[14px] font-semibold">{name}</p>
        <p className="text-xs font-light">Absences: {totalAbsences}</p>
      </div>
    </div>
  );
};

export const StudentModalContentWrapper = ({
  studentStats,
  student_id,
  group_id,
  onClickCancel,
}: any) => {
  const [modalToDisplay, setModalToDisplay] = useState<
    "declare_ap" | "ConfirmAp"
  >("declare_ap");

  const handleGoToConfirmAp = () => {
    if (selectedDates.length === 0) {
      alert("Veuillez sélectionner au moins une date avant de continuer.");
    } else {
      setModalToDisplay("ConfirmAp");
    }
  };

  const handleBackToStudentDetails = () => {
    setModalToDisplay("declare_ap");
  };
  const [selectedDates, selectedDatesFunctions] = useList<string>([]);

  if (modalToDisplay === "declare_ap") {
    return (
      <p>
        <StudentDates
          name={studentStats.name}
          student_id={student_id}
          group_id={group_id}
          start_date=""
          end_date=""
          onClickCancel={onClickCancel}
          onClickValidate={handleGoToConfirmAp}
          selectedDates={selectedDates}
          selectedDatesFunctions={selectedDatesFunctions}
        />
      </p>
    );
  }

  return (
    <p>
      <ConfirmAp
        student={{
          student_id: student_id,
          firstname: studentStats.firstname, 
          lastname: studentStats.lastname,
        }}
        onClickCancel={handleBackToStudentDetails}
        onClickValidate={() => {}}
        selectedDates={selectedDates}
        groupId={group_id}
      />
    </p>
  );
};
