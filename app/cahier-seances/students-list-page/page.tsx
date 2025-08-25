"use client";

import useGroup from "@/hooks/useGroup";
import { useSearchParams } from "next/navigation";
import { displayDate, formatSlotWithDayAndTime } from "@/lib/dates";
import clsx from "clsx";
import { Student } from "@/components/FeuilleEmargement";
import { useTeacher } from "@/app/TeacherContext";
import { useLastPresence } from "@/components/FeuilleEmargement";
import HeaderWithRecapButton from "@/components/HeaderWithRecapButton";
import { Modal } from "@mantine/core";
import { getWorkbookContentInfo } from "@/api";
import CorrespondenceViewModal from "@/components/CorrespondenceViewModal";
import CorrespondenceV2 from "@/components/CorrespondenceV2";
import StatusBadge from "@/components/StatusBadge";
import { useEffect, useState, useMemo } from "react";

const StudentsListPage = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const workbookDate = search.get("date");
  const [courseDate, setCourseDate] = useState<string>("");
  const correspondenceMode = (search.get("correspondenceMode") ||
    search.get("mode")) as "liaison" | "homework" | null;

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "view">("view");
  const [isCheckingContent, setIsCheckingContent] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  const [studentsContent, setStudentsContent] = useState<
    Record<
      number,
      {
        liaison?: string;
        homework?: string;
      }
    >
  >({});

  const loadAllStudentsContent = async () => {
    if (
      !teacherId ||
      !courseDate ||
      allStudents.length === 0 ||
      isLoadingContent ||
      contentLoaded
    ) {
      return;
    }

    console.log(
      "Début du chargement du contenu pour",
      allStudents.length,
      "étudiants"
    );
    setIsLoadingContent(true);

    try {
      const contentPromises = allStudents.map(async (student: Student) => {
        try {
          const contentInfo = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            student_id: Number(student.id),
            date: courseDate,
          });
          return {
            studentId: Number(student.id),
            liaison: contentInfo.result?.liaison,
            homework: contentInfo.result?.homework,
          };
        } catch (error) {
          console.error(`Erreur pour l'étudiant ${student.id}:`, error);
          return {
            studentId: Number(student.id),
            liaison: undefined,
            homework: undefined,
          };
        }
      });

      const results = await Promise.all(contentPromises);
      const contentMap: Record<
        number,
        { liaison?: string; homework?: string }
      > = {};

      results.forEach((result) => {
        contentMap[result.studentId] = {
          liaison: result.liaison,
          homework: result.homework,
        };
      });

      setStudentsContent(contentMap);
      setContentLoaded(true);
      console.log("Contenu chargé avec succès");
    } catch (error) {
      console.error(" Erreur lors du chargement du contenu:", error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const updateStudentContentImmediately = (
    studentId: number,
    liaison?: string,
    homework?: string
  ) => {
    setStudentsContent((prev) => ({
      ...prev,
      [studentId]: {
        liaison: liaison,
        homework: homework,
      },
    }));
  };

  const refreshStudentContent = async (studentId: number) => {
    if (!teacherId || !courseDate) {
      return;
    }

    try {
      console.log(`Rafraîchissement du contenu pour l'étudiant ${studentId}`);

      const contentInfo = await getWorkbookContentInfo({
        group_id: groupId,
        teacher_id: teacherId,
        student_id: studentId,
        date: courseDate,
      });

      setStudentsContent((prev) => ({
        ...prev,
        [studentId]: {
          liaison: contentInfo.result?.liaison,
          homework: contentInfo.result?.homework,
        },
      }));

      console.log(`Contenu rafraîchi pour l'étudiant ${studentId}`);
    } catch (error) {
      console.error(
        `Erreur lors du rafraîchissement pour l'étudiant ${studentId}:`,
        error
      );
    }
  };

  const isContentFilled = (studentId: number): boolean => {
    const content = studentsContent[studentId];
    if (!content) return false;

    if (correspondenceMode === "liaison") {
      return !isContentEmpty(content.liaison);
    } else if (correspondenceMode === "homework") {
      return !isContentEmpty(content.homework);
    }
    return false;
  };

  const isContentEmpty = (content: string | undefined | null): boolean => {
    return (
      !content ||
      content === "no_liaison" ||
      content === "NA" ||
      content.trim() === ""
    );
  };

  const handleStudentClick = async (student: Student) => {
    setSelectedStudent(student);
    setIsCheckingContent(true);

    try {
      const contentInfo = await getWorkbookContentInfo({
        group_id: groupId,
        teacher_id: teacherId || 0,
        student_id: Number(student.id),
        date: courseDate,
      });

      const liaison = contentInfo.result?.liaison;
      const homework = contentInfo.result?.homework;

      const isLiaisonEmpty = isContentEmpty(liaison);
      const isHomeworkEmpty = isContentEmpty(homework);

      let shouldEdit = false;

      if (correspondenceMode === "homework") {
        shouldEdit = isHomeworkEmpty;
      } else if (correspondenceMode === "liaison") {
        shouldEdit = isLiaisonEmpty;
      } else {
        shouldEdit = isLiaisonEmpty || isHomeworkEmpty;
      }

      if (shouldEdit) {
        setModalMode("edit");
        setModalOpen(true);
      } else {
        setModalMode("view");
        setViewModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du contenu:", error);
      setModalMode("edit");
      setModalOpen(true);
    } finally {
      setIsCheckingContent(false);
    }
  };

  const { teacherId } = useTeacher();
  const { data: lastPresenceData } = useLastPresence(teacherId, groupId);

  useEffect(() => {
    if (workbookDate) {
      console.log("Utilisation de la date du workbook de l'URL:", workbookDate);
      setCourseDate(workbookDate);
    } else {
      const storedDate = localStorage.getItem("selectedWorkbookDate");
      if (storedDate) {
        console.log(
          "Utilisation de la date stockée en localStorage:",
          storedDate
        );
        setCourseDate(storedDate);
      } else {
        console.log("Aucune date disponible");
      }
    }
  }, [workbookDate]);

  useEffect(() => {
    if (workbookDate) {
      console.log("Utilisation de la date du workbook:", workbookDate);
      setCourseDate(workbookDate);
    }
  }, [workbookDate]);

  const { allStudents, groupsStatistics, getStudentStatistics } = useGroup({
    date: courseDate,
    groupId,
  });

  const studentsLength = useMemo(
    () => allStudents.length,
    [allStudents.length]
  );

  useEffect(() => {
    if (
      teacherId &&
      courseDate &&
      studentsLength > 0 &&
      !contentLoaded &&
      !isLoadingContent
    ) {
      console.log(" Déclenchement du chargement du contenu");
      loadAllStudentsContent();
    }
  }, [teacherId, courseDate, studentsLength, contentLoaded, isLoadingContent]);

  useEffect(() => {
    setContentLoaded(false);
    setStudentsContent({});
  }, [groupId, courseDate, correspondenceMode]);

  const getViewType = (): "Carnet de liaison" | "Devoir individuel" => {
    console.log("correspondenceMode dans getViewType:", correspondenceMode);
    if (correspondenceMode === "homework") {
      return "Devoir individuel";
    }
    return "Carnet de liaison";
  };

  if (!groupId) return <p>Veuillez spécifier un groupe et une date</p>;
  if (!courseDate) return <p>Calcul de la date du cours...</p>;

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden md:hidden">
      <div className="px-10 py-6">
        <HeaderWithRecapButton
          title="Effectif du groupe"
          groupRecap={groupsStatistics}
        />
      </div>
      {groupName && groupSlot && (
        <div>
          <h1 className="text-xl font-bold text-center">{groupName}</h1>
          <p className="text-md font-semibold text-center">
            {formatSlotWithDayAndTime(groupSlot)}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2 p-5 min-h-[33%] max-h-[78%] grow overflow-y-auto">
        {[...allStudents]
          .sort((a, b) => {
            const aAbandoned = a.abort && a.abort !== "0";
            const bAbandoned = b.abort && b.abort !== "0";
            return Number(aAbandoned) - Number(bAbandoned);
          })
          .map((student: Student) => {
            const isAbandoned = student.abort && student.abort !== "0";
            return (
              <div
                key={student.id}
                onClick={() =>
                  !isCheckingContent && handleStudentClick(student)
                }
                className={clsx(
                  "flex flex-row shadow-md rounded-2xl justify-between h-[4.5rem] relative",
                  isCheckingContent && selectedStudent?.id === student.id
                    ? "cursor-wait opacity-50"
                    : "cursor-pointer",
                  isAbandoned ? "bg-gray-200" : "bg-white"
                )}
              >
                <div className="flex items-center w-full">
                  {isAbandoned ? (
                    <div className="rounded-l-2xl h-[4.5rem] flex items-center justify-center bg-gray-300 w-[3rem]">
                      <p className="text-transparent text-center text-md font-semibold p-2">
                        abd
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-l-2xl h-full flex items-center justify-center bg-shatibi-orange w-[3rem]">
                      <p className="text-white text-center text-md font-semibold p-2">
                        {getStudentStatistics(student.id).totalAbsences}
                        <br />
                        Abs
                      </p>
                    </div>
                  )}
                  <div className="pl-3 flex items-center justify-between h-full flex-1">
                    <div className="flex flex-col justify-center">
                      <p className="text-[0.875rem] font-semibold">
                        {student.name}
                      </p>
                      {isAbandoned ? (
                        <p className="text-xs font-normal">
                          Abandon depuis&nbsp;
                          <span className="text-black font-semibold">
                            {displayDate(student.abort)}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs font-normal">
                          {(() => {
                            const absences = lastPresenceData?.result.find(
                              (s) => s.student_id === student.id
                            )?.absences;

                            if (absences === 0) return null;
                            if (absences === 1)
                              return "Absent à la dernière séance";
                            if (absences && absences > 1) {
                              return (
                                <>
                                  Absent depuis
                                  <span className="text-black font-semibold">
                                    {` ${absences} séances`}
                                  </span>
                                </>
                              );
                            }
                            return null;
                          })()}
                        </p>
                      )}
                    </div>

                    {!isAbandoned && correspondenceMode && (
                      <div className="pr-4">
                        <StatusBadge
                          status={isContentFilled(Number(student.id))}
                          completedText="Rempli"
                          showOnlyWhenFilled={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {isCheckingContent && selectedStudent?.id === student.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-2xl">
                    <span className="text-sm text-gray-600">
                      Vérification...
                    </span>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <CorrespondenceViewModal
        studentName={selectedStudent?.name || ""}
        studentId={Number(selectedStudent?.id) || 0}
        groupId={groupId}
        teacherId={teacherId || 0}
        date={workbookDate || ""}
        groupName={groupName || ""}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        viewType={getViewType()}
        onContentUpdated={() =>
          refreshStudentContent(Number(selectedStudent?.id))
        }
      />

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        withCloseButton={false}
        radius="lg"
        centered
      >
        {selectedStudent && (
          <CorrespondenceV2
            name={selectedStudent.name || ""}
            groupId={groupId}
            teacherId={teacherId || 0}
            studentId={Number(selectedStudent.id)}
            date={workbookDate || ""}
            onComplete={() => {
              setModalOpen(false);
              refreshStudentContent(Number(selectedStudent.id));
            }}
            defaultTab={
              correspondenceMode === "homework" ? "devoir" : "liaison"
            }
            correspondenceMode={correspondenceMode}
            onContentUpdated={() =>
              refreshStudentContent(Number(selectedStudent.id))
            }
            onImmediateUpdate={(liaison, homework) =>
              updateStudentContentImmediately(
                Number(selectedStudent.id),
                liaison,
                homework
              )
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default StudentsListPage;
