"use client";
import Image from "next/image";
import User from "@/public/search-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@mantine/core";
import StudentGroups from "./StudentGroups";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import { Group, searchStudentByName, getStudentGroups, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import { StudentDates } from "./StudentDates";
import CorrespondenceV2 from "./CorrespondenceV2";

interface StudentInfoFromSearch {
  student_id: number;
  lastname: string;
  firstname: string;
}

interface SelectedStudent {
  student_id: number;
  firstname: string;
  lastname: string;
  group_id: number;
}

interface CorrespondanceWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorrespondanceWorkflow = ({
  isOpen,
  onClose,
}: CorrespondanceWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState<
    "search" | "groups" | "dates" | "correspondence"
  >("search");
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedStudent | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [studentName, setStudentName] = useState("");

  const { teacherId } = useTeacher();
  const router = useRouter();

  const search = useSearchParams();
  const correspondenceMode = (search.get("correspondenceMode") ||
    search.get("mode")) as "liaison" | "homework" | null;

  console.log(
    "correspondenceMode récupéré dans CorrespondanceWorkflow:",
    correspondenceMode
  );
  /*
  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery<Group[], Error>({
    queryKey: [QUERY_KEY.GROUPS, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getGroups(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });
    */

  const { data: studentsSearchResult, isLoading: isStudentLoading } = useQuery<
    StudentInfoFromSearch[]
  >({
    queryKey: [QUERY_KEY.SEARCH_STUDENT, studentName, teacherId],
    queryFn: () => {
      if (!teacherId) {
        throw new Error("Teacher ID is required to search for students");
      }
      return searchStudentByName(studentName, teacherId);
    },
    enabled: !!studentName && !!teacherId,
  });

  const selectedDatesFunctions = {
    push: (date: string) => {
      setSelectedDates((prev) => [...prev, date]);
    },
    removeAt: (index: number) => {
      setSelectedDates((prev) => prev.filter((_, i) => i !== index));
    },
    reset: () => {
      setSelectedDates([]);
    },
  };

  const handleNameChange = (event: any) => {
    setStudentName(event.target.value);
  };

  const handleStudentClick = async (student: StudentInfoFromSearch) => {
    try {
      const studentGroupsResponse = await getStudentGroups(
        student.student_id,
        teacherId!
      );

      if (studentGroupsResponse && studentGroupsResponse.result.group_list) {
        const studentGroups = studentGroupsResponse.result.group_list;

        if (studentGroups.length === 1) {
          setSelectedStudent({
            student_id: student.student_id,
            firstname: student.firstname,
            lastname: student.lastname,
            group_id: studentGroups[0].id,
          });
          setCurrentStep("dates");
        } else {
          setSelectedStudent({
            student_id: student.student_id,
            firstname: student.firstname,
            lastname: student.lastname,
            group_id: 0,
          });
          setCurrentStep("groups");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  };

  const handleGroupSelectionFromChild = (groupData: any) => {
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        group_id: groupData.group_id,
      });
      setCurrentStep("dates");
    }
  };

  useEffect(() => {
    const handleGroupSelection = (event: CustomEvent) => {
      handleGroupSelectionFromChild(event.detail);
    };

    window.addEventListener(
      "groupSelected",
      handleGroupSelection as EventListener
    );

    return () => {
      window.removeEventListener(
        "groupSelected",
        handleGroupSelection as EventListener
      );
    };
  }, [selectedStudent]);

  const handleDatesValidate = () => {
    setCurrentStep("correspondence");
  };

  const handleDatesCancel = () => {
    if (selectedStudent && selectedStudent.group_id === 0) {
      setCurrentStep("groups");
    } else {
      setCurrentStep("search");
    }
    setSelectedDates([]);
  };

  const handleCorrespondenceComplete = () => {
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep("search");
    setSelectedStudent(null);
    setSelectedDates([]);
    setStudentName("");
    onClose();
  };

  /*
  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;
  */
  const showStudentSearchResults =
    studentName.length > 0 &&
    (isStudentLoading || studentsSearchResult !== undefined);

  // const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      withCloseButton={false}
      radius="lg"
      centered
      size={currentStep === "correspondence" ? "lg" : "md"}
    >
      {currentStep === "search" && (
        <div className="relative p-2 justify-items-center flex flex-col items-center">
          <h3 className="text-center text-lg font-semibold text-black mb-8">
            Gestion de la correspondance
          </h3>

          <div className="mb-4 bg-white rounded-xl shadow w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 h-24 mx-auto">
            <div className="flex gap-2 pl-4 place-items-center">
              <Image className="mt-2" src={User} alt="User" />
              <label
                htmlFor="searchStudentByName"
                className="block text-sm font-semibold mt-2"
              >
                Rechercher par nom :
              </label>
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                id="searchByName"
                className="w-10/12 p-3 border rounded-full mt-2 text-xs h-10"
                placeholder=""
                value={studentName}
                onChange={handleNameChange}
              />
            </div>
          </div>

          {showStudentSearchResults && (
            <div className="mb-4 bg-white rounded-xl shadow w-full h-64 lg:h-80 xl:h-96 max-h-[63%] overflow-y-scroll">
              <div className="flex flex-col items-center justify-center space-y-2">
                {studentsSearchResult && studentsSearchResult.length > 0 ? (
                  <div className="w-full px-4 py-2">
                    {studentsSearchResult.map((student) => (
                      <div
                        key={student.student_id}
                        className="bg-white px-4 py-2 rounded-lg shadow-md mt-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleStudentClick(student)}
                      >
                        <p className="font-semibold text-sm truncate">
                          {`${student.firstname} ${student.lastname}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isStudentLoading && (
                    <div className="text-black text-base font-medium mt-24">
                      Aucun étudiant trouvé
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {studentName.length === 0 && (
        <div className="mb-4 bg-white rounded-xl shadow w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-black text-base font-medium mb-2">
              Tapez un nom pour rechercher un étudiant
            </p>
          </div>
        </div>
      )}

      {currentStep === "groups" && selectedStudent && (
        <StudentGroups
          name={`${selectedStudent.firstname} ${selectedStudent.lastname}`}
          studentId={selectedStudent.student_id}
          onCancel={handleClose}
        />
      )}

      {currentStep === "dates" && selectedStudent && (
        <StudentDates
          group_id={selectedStudent.group_id.toString()}
          student_id={selectedStudent.student_id.toString()}
          name={`${selectedStudent.firstname} ${selectedStudent.lastname}`}
          onClickCancel={handleDatesCancel}
          onClickValidate={handleDatesValidate}
          selectedDates={selectedDates}
          selectedDatesFunctions={selectedDatesFunctions}
        />
      )}

      {currentStep === "correspondence" && selectedStudent && teacherId && (
        <CorrespondenceV2
          name={`${selectedStudent.firstname} ${selectedStudent.lastname}`}
          groupId={selectedStudent.group_id}
          teacherId={teacherId}
          studentId={selectedStudent.student_id}
          date={selectedDates[0] || ""}
          onComplete={handleCorrespondenceComplete}
          defaultTab={correspondenceMode === "homework" ? "devoir" : "liaison"}
          correspondenceMode={correspondenceMode}
        />
      )}
    </Modal>
  );
};

export default CorrespondanceWorkflow;
