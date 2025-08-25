"use client";
import { useEffect, useState } from "react";
import ConfirmAp from "@/components/ConfirmAp";
import { useList } from "react-use";
import { StudentDates } from "@/components/StudentDates";
import { useSearchParams } from "next/navigation";
import { StudentStatistics } from "@/components/StudentStatistics";
import { useTeacher } from "@/app/TeacherContext";
import CorresConfirm from "@/components/CorresConfim";

export interface Absence {
  date: string;
  type: "AP" | "AI";
}

export const StudentModalContentWrapper = ({
  studentStats,
  student_id,
  group_id,
  onClickCancel,
}: any) => {
  const [modalToDisplay, setModalToDisplay] = useState<
    "StudentStatistics" | "StudentDates" | "ConfirmAp" | "CorresConfirm"
  >("StudentStatistics");
  const [absencesList, setAbsencesList] = useState<Absence[]>([]);
  const search = useSearchParams();
  const date = search.get("date") || "";
  const { teacherId } = useTeacher();

  useEffect(() => {
    if (studentStats) {
      const absences: Absence[] = [];
      for (let i = 0; i < (studentStats.ai || 0); i++) {
        absences.push({
          date: date || "Date non spécifiée",
          type: "AI",
        });
      }
      for (let i = 0; i < (studentStats.ap || 0); i++) {
        absences.push({
          date: date || "Date non spécifiée",
          type: "AP",
        });
      }
      setAbsencesList(absences);
    }
  }, [studentStats, date]);

  const handleGoToConfirmAp = () => {
    if (selectedDates.length === 0) {
      alert("Veuillez sélectionner au moins une date avant de continuer.");
    } else {
      setModalToDisplay("ConfirmAp");
    }
  };

  const handleBackToStudentDetails = () => {
    setModalToDisplay("StudentDates");
  };

  const handleClickCancelStudentDates = () => {
    setModalToDisplay("StudentStatistics");
  };

  const handleShowConfirmationSuccess = () => {
    setModalToDisplay("CorresConfirm");
  };

  const handleCloseCorresConfirm = () => {
    onClickCancel();
  };

  const [selectedDates, selectedDatesFunctions] = useList<string>([]);

  return (
    <>
      {modalToDisplay === "StudentStatistics" && (
        <StudentStatistics
          name={studentStats.name}
          ai={studentStats.ai}
          ap={studentStats.ap}
          totalSessions={studentStats.totalSessions}
          studentPercentage={studentStats.presencePercentage}
          onClickDeclarerAp={() => setModalToDisplay("StudentDates")}
          onClickCancel={onClickCancel}
          absencesList={absencesList}
          groupId={group_id}
          studentId={student_id}
          teacherId={teacherId || 0}
          date={date}
          onSendSuccess={handleShowConfirmationSuccess}
        />
      )}
      {modalToDisplay === "StudentDates" && (
        <StudentDates
          name={studentStats.name}
          student_id={student_id}
          group_id={group_id}
          start_date=""
          end_date=""
          onClickCancel={handleClickCancelStudentDates}
          onClickValidate={handleGoToConfirmAp}
          selectedDates={selectedDates}
          selectedDatesFunctions={selectedDatesFunctions}
        />
      )}
      {modalToDisplay === "ConfirmAp" && (
        <ConfirmAp
          student={{
            student_id: student_id,
            firstname: studentStats.firstname,
            lastname: studentStats.lastname,
          }}
          groupId={group_id}
          onClickCancel={handleBackToStudentDetails}
          onClickValidate={() => {}}
          selectedDates={selectedDates}
        />
      )}
      {modalToDisplay === "CorresConfirm" && (
        <CorresConfirm
          onConfirm={handleCloseCorresConfirm}
          onCancel={handleCloseCorresConfirm}
        />
      )}
    </>
  );
};

export default StudentModalContentWrapper;
