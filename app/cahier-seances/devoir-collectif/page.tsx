"use client";

import useGroup from "@/hooks/useGroup";
import { useSearchParams } from "next/navigation";
import { displayDate, formatSlotWithDayAndTime } from "@/lib/dates";
import clsx from "clsx";
import { Student } from "@/components/FeuilleEmargement";
import { useTeacher } from "@/app/TeacherContext";
import { useEffect, useState } from "react";
import EvaluationHeader from "@/components/EvaluationHeader";
import PaperClip from "@/public/assets/Paperclip.svg";
import Image from "next/image";
import StatusBadge from "@/components/StatusBadge";
import { getHomeworkStudentList, HomeworkStudent } from "@/api/index";
import DocumentViewer from "@/components/DocumentViewer";

const DevoirCollectifPage = () => {
  const search = useSearchParams();
  const groupId = Number(search.get("groupId"));
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const workbookDate = search.get("date");
  const workbookId = Number(search.get("workbookId"));

  const [courseDate, setCourseDate] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [homeworkStudents, setHomeworkStudents] = useState<HomeworkStudent[]>(
    []
  );
  const [isLoadingHomework, setIsLoadingHomework] = useState(false);
  const [homeworkError, setHomeworkError] = useState<string | null>(null);

  const { teacherId } = useTeacher();

  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
    mime?: string;
  } | null>(null);
  const [selectedStudentDocuments, setSelectedStudentDocuments] = useState<
    { name: string; stUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchHomeworkData = async () => {
      if (!workbookId || !teacherId) {
        console.log("workbookId ou teacherId manquant:", {
          workbookId,
          teacherId,
        });
        return;
      }

      setIsLoadingHomework(true);
      setHomeworkError(null);

      try {
        console.log("Appel API avec:", { workbookId, teacherId });
        const response = await getHomeworkStudentList(workbookId, teacherId);
        console.log("Réponse API:", response);
        setHomeworkStudents(response.result);
      } catch (error) {
        console.error("Erreur API:", error);
        setHomeworkError(
          error instanceof Error ? error.message : "Erreur inconnue"
        );
      } finally {
        setIsLoadingHomework(false);
      }
    };

    fetchHomeworkData();
  }, [workbookId, teacherId]);

  const getHomeworkStatusMap = (): Map<number, HomeworkStudent> => {
    const statusMap = new Map<number, HomeworkStudent>();
    homeworkStudents.forEach((student) => {
      statusMap.set(student.student_id, student);
    });
    return statusMap;
  };

  const homeworkStatusMap = getHomeworkStatusMap();

  const getHomeworkStatus = (studentId: number): boolean => {
    const homeworkStudent = homeworkStatusMap.get(studentId);
    return homeworkStudent?.validated === "1";
  };

  const getHomeworkDisplayText = (studentId: number): string => {
    const homeworkStudent = homeworkStatusMap.get(studentId);

    if (!homeworkStudent || homeworkStudent.validated === "0") {
      return "";
    }

    if (
      homeworkStudent.validated_date &&
      homeworkStudent.validated_date !== ""
    ) {
      return `Envoyé le ${displayDate(homeworkStudent.validated_date)}`;
    }

    return "Devoir envoyé";
  };
  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleHomeworkFileClick = (student: Student) => {
    console.log(
      "Recherche de documents pour:",
      student.name,
      "ID:",
      student.id
    );

    let homeworkStudent = homeworkStatusMap.get(student.id);

    if (!homeworkStudent) {
      homeworkStudent = homeworkStudents.find(
        (hs) =>
          `${hs.firstname} ${hs.lastname}`.toLowerCase() ===
          student.name.toLowerCase()
      );
      console.log(
        "Recherche par nom:",
        homeworkStudent ? "trouvé" : "non trouvé"
      );
    }

    if (
      homeworkStudent &&
      homeworkStudent.docList &&
      homeworkStudent.docList.length > 0
    ) {
      console.log("Documents trouvés:", homeworkStudent.docList);

      if (homeworkStudent.docList.length === 1) {
        const doc = homeworkStudent.docList[0];
        setSelectedDocument({
          name: doc.name,
          url: doc.stUrl,
          mime: undefined,
        });
        setDocumentViewerOpen(true);
      } else {
        const documentNames = homeworkStudent.docList
          .map((doc) => doc.name)
          .join("\n");
        const choice = confirm(
          `${student.name} a ${homeworkStudent.docList.length} documents:\n\n${documentNames}\n\nVoulez-vous ouvrir le premier document?`
        );

        if (choice) {
          const doc = homeworkStudent.docList[0];
          setSelectedDocument({
            name: doc.name,
            url: doc.stUrl,
            mime: undefined,
          });
          setDocumentViewerOpen(true);
        }
      }
    } else {
      console.log("Aucun document trouvé pour:", student.name);
      alert(`Aucun document trouvé pour ${student.name}`);
    }
  };

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

  const { allStudents, groupsStatistics, getStudentStatistics } = useGroup({
    date: courseDate,
    groupId,
  });

  if (!groupId) return <p>Veuillez spécifier un groupe et une date</p>;
  if (!courseDate) return <p>Calcul de la date du cours...</p>;
  if (!teacherId) return <p>Chargement des informations du professeur...</p>;
  if (!workbookId) return <p>Identifiant du cahier de séance manquant</p>;
  if (isLoadingHomework) return <p>Chargement de la liste des devoirs...</p>;
  if (homeworkError) return <p>Erreur: {homeworkError}</p>;

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden md:hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Devoir collectif" />
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
            const homeworkStatus = getHomeworkStatus(student.id);

            return (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className={clsx(
                  "flex flex-row shadow-md rounded-2xl justify-between h-[4.5rem] cursor-pointer",
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
                  <div className="pl-3 flex flex-col justify-center h-full">
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
                      getHomeworkDisplayText(student.id) && (
                        <p className="text-xs font-normal">
                          {getHomeworkDisplayText(student.id)}
                        </p>
                      )
                    )}
                  </div>
                </div>

                {!isAbandoned && (
                  <div className="flex items-center gap-2 pr-3">
                    <StatusBadge status={homeworkStatus} />

                    {homeworkStatus &&
                      (homeworkStatusMap.get(student.id)?.docList?.length ||
                        0) > 0 && (
                        <div
                          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHomeworkFileClick(student);
                          }}
                        >
                          <Image
                            src={PaperClip}
                            alt="Voir le devoir"
                            width={16}
                            height={16}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <DocumentViewer
        document={selectedDocument}
        isOpen={documentViewerOpen}
        onClose={() => {
          setDocumentViewerOpen(false);
          setSelectedDocument(null);
          setSelectedStudentDocuments([]);
        }}
      />
    </div>
  );
};

export default DevoirCollectifPage;
