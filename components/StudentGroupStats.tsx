"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Button from "@/components/Button";
import calendar from "@/public/calendar.svg";
import { extrairePrenom } from "@/lib/format-utils";
import { formatDateWithWeekday } from "@/lib/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeacher } from "@/app/TeacherContext";
import PaperClip from "@/public/assets/Paperclip.svg";
import Image from "next/image";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import {
  addWorkbookDocument,
  deleteWorkbookDocument,
  getWorkbookContentInfo,
  getStudents,
  setWorkbookContent,
  getWorkbookList,
} from "@/api/index";
import DocumentViewer from "@/components/DocumentViewer";
import CustomCalendar from "./CustomCalendar";

interface StudentData {
  id: number;
  student_id: number;
  firstname: string;
  lastname: string;
  nb_ap?: number;
  nb_ai?: number;
  absence_list?: {
    ai: string[];
    ap: string[];
  };
  absences?: Array<{
    date: string;
    type: "AP" | "AI";
  }>;
}

interface Absence {
  date?: string;
  type: "AP" | "AI";
}

export interface StudentGroupStatsProps {
  name: string;
  ai: number;
  ap: number;
  studentPercentage: number;
  totalSessions?: number;
  onClickCancel?: () => void;
  onClickDeclarerAp: () => void;
  absencesList?: Absence[];
  groupId: number;
  teacherId: number;
  studentId: number;
  date: string;
  onSendSuccess?: () => void;
}

interface ViewableDocument {
  name: string;
  url: string;
  mime?: string;
}

interface AttachedFile {
  name: string;
  url: string;
  uploading: boolean;
  type?: string;
}

export const StudentGroupStats = ({
  name,
  ai,
  ap,
  studentPercentage,
  onClickDeclarerAp,
  absencesList = [],
  studentId,
  onSendSuccess,
}: StudentGroupStatsProps) => {
  const [activeTab, setActiveTab] = useState("assiduité");
  const [messageToParents, setMessageToParents] = useState("");
  const [sendingStatus, setSendingStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [homeworkInput, setHomeworkInput] = useState("");
  const router = useRouter();
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [liaisonId, setLiaisonId] = useState<number>(0);
  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);
  const search = useSearchParams();
  const teacherContext = useTeacher();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const teacherId = teacherContext?.teacherId;
  const groupId = Number(search.get("groupId") || "0");
  const date = search.get("date") || "";
  const [studentsData, setStudentsData] = useState<StudentData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAbsencesList, setUpdatedAbsencesList] = useState<Absence[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateFromUrl = search.get("date") || "";
    return dateFromUrl;
  });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [datesWithContent, setDatesWithContent] = useState<string[]>([]);
  const [completeDates, setCompleteDates] = useState<string[]>([]);
  const [emptyDates, setEmptyDates] = useState<string[]>([]);

  const fetchAvailableDates = useCallback(async () => {
    if (!groupId || !teacherId || !studentId) return;

    setIsLoadingDates(true);
    try {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear - 1, 8, 1);
      const endDate = new Date(currentYear + 1, 5, 30);

      const response = await getWorkbookList(
        groupId,
        teacherId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      const dates = response.result.map((workbook) => workbook.date);
      console.log("Dates disponibles:", dates);

      const dateStatusPromises = dates.map(async (date) => {
        try {
          const contentInfo = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: date,
            student_id: studentId,
          });

          const liaison = contentInfo.result?.liaison;
          const homework = contentInfo.result?.homework;

          console.log(`Date ${date}:`, { liaison, homework });

          const isLiaisonFilled =
            liaison &&
            liaison !== "no_workbook" &&
            liaison !== "NA" &&
            liaison !== "no_liaison" &&
            liaison.trim() !== "";

          const isHomeworkFilled =
            homework &&
            homework !== "no_workbook" &&
            homework !== "NA" &&
            homework !== "no_liaison" &&
            homework.trim() !== "";

          const result = {
            date,
            hasContent: isLiaisonFilled || isHomeworkFilled,
            isComplete: isLiaisonFilled && isHomeworkFilled,
            isLiaisonFilled,
            isHomeworkFilled,
          };

          console.log(`Résultat pour ${date}:`, result);
          return result;
        } catch (error) {
          console.error(`Erreur pour la date ${date}:`, error);
          return { date, hasContent: false, isComplete: false };
        }
      });

      const dateStatuses = await Promise.all(dateStatusPromises);
      console.log("Tous les statuts:", dateStatuses);

      const datesWithContent = dateStatuses
        .filter((status) => status.hasContent)
        .map((status) => status.date);

      const completeDates = dateStatuses
        .filter((status) => status.isComplete)
        .map((status) => status.date);

      const emptyDates = dateStatuses
        .filter((status) => !status.hasContent)
        .map((status) => status.date);

      console.log("Dates avec contenu:", datesWithContent);
      console.log("Dates complètes:", completeDates);
      console.log("Dates vides:", emptyDates);

      setAvailableDates(dates);
      setDatesWithContent(datesWithContent);
      setCompleteDates(completeDates);
      setEmptyDates(emptyDates);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des dates disponibles:",
        error
      );
      setAvailableDates([]);
      setDatesWithContent([]);
      setCompleteDates([]);
      setEmptyDates([]);
    } finally {
      setIsLoadingDates(false);
    }
  }, [groupId, teacherId, studentId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);

    const params = new URLSearchParams(search.toString());
    params.set("date", newDate);

    setIsDatePickerOpen(false);

    router.replace(`?${params.toString()}`);

    loadExistingData(newDate);
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (!groupId || !teacherId) {
        setError("Informations de groupe ou d'enseignant manquantes");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getStudents(groupId, teacherId);
        setStudentsData(response.result);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données étudiants:",
          err
        );
        setError("Impossible de récupérer les données d'absence");
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId && teacherId) {
      fetchStudentsData();
    }
  }, [groupId, teacherId]);

  useEffect(() => {
    if (studentsData && studentsData.length > 0 && studentId) {
      const currentStudent = studentsData.find(
        (student) => student.id === studentId
      );

      if (currentStudent) {
        const formattedAbsences: Absence[] = [];

        if (currentStudent.absence_list) {
          if (
            currentStudent.absence_list.ai &&
            Array.isArray(currentStudent.absence_list.ai)
          ) {
            currentStudent.absence_list.ai.forEach((date) => {
              formattedAbsences.push({
                date: date,
                type: "AI",
              });
            });
          }

          if (
            currentStudent.absence_list.ap &&
            Array.isArray(currentStudent.absence_list.ap)
          ) {
            currentStudent.absence_list.ap.forEach((date) => {
              formattedAbsences.push({
                date: date,
                type: "AP",
              });
            });
          }
        } else {
          const nbTotalAbsences =
            (currentStudent?.nb_ap || 0) + (currentStudent?.nb_ai || 0);

          for (let i = 0; i < nbTotalAbsences; i++) {
            formattedAbsences.push({
              date: undefined,
              type: i < (currentStudent?.nb_ai || 0) ? "AI" : "AP",
            });
          }
        }

        formattedAbsences.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setUpdatedAbsencesList(formattedAbsences);
      }
    }
  }, [studentsData, studentId]);

  const handleOpenConfirmationModal = () => {
    if (!homeworkInput.trim() && attachedFiles.length === 0) {
      alert("Veuillez saisir un devoir ou joindre au moins un document");
      return;
    }

    if (!groupId || !teacherId || !studentId || !date) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    handleSendHomework();
  };

  const handleSendInfo = async (): Promise<void> => {
    if (!messageToParents.trim()) {
      alert("Veuillez saisir un message");
      return;
    }

    if (!groupId || !teacherId || !studentId || !selectedDate) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });

      const currentHomework: string = homeworkInput;

      await setWorkbookContent({
        group_id: groupId,
        date: selectedDate,
        teacher_id: teacherId,
        student_id: studentId,
        liaison: messageToParents,
        homework: currentHomework,
      });

      if (!liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: selectedDate,
            student_id: studentId,
          });

          if (infoResponse.result && infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du liaison_id:", error);
        }
      }

      if (onSendSuccess) {
        onSendSuccess();
      } else {
        setSendingStatus({ loading: false, success: true, error: "" });
        setTimeout(() => {
          setSendingStatus({ loading: false, success: false, error: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  const handleSendHomework = async (): Promise<void> => {
    if (!homeworkInput.trim() && attachedFiles.length === 0) {
      alert("Veuillez saisir un devoir ou joindre au moins un document");
      return;
    }

    if (!groupId || !teacherId || !studentId || !selectedDate) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });

      const currentLiaison: string = messageToParents;

      await setWorkbookContent({
        group_id: groupId,
        date: selectedDate,
        teacher_id: teacherId,
        student_id: studentId,
        liaison: currentLiaison,
        homework: homeworkInput,
      });

      if (!liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: selectedDate,
            student_id: studentId,
          });

          if (infoResponse.result && infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du liaison_id:", error);
        }
      }

      if (onSendSuccess) {
        onSendSuccess();
      } else {
        setSendingStatus({ loading: false, success: true, error: "" });
        setTimeout(() => {
          setSendingStatus({ loading: false, success: false, error: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du devoir:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!teacherId) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Identifiant enseignant manquant",
      });
      return;
    }

    const isHomework = activeTab === "Devoir indiv.";

    if (!liaisonId) {
      try {
        setSendingStatus({ loading: true, success: false, error: "" });

        if (!groupId || !studentId || !selectedDate) {
          throw new Error("Informations manquantes pour créer le document");
        }

        await setWorkbookContent({
          group_id: groupId,
          date: selectedDate,
          teacher_id: teacherId,
          student_id: studentId,
          liaison: messageToParents || " ",
          homework: homeworkInput || " ",
        });

        const infoResponse = await getWorkbookContentInfo({
          group_id: groupId,
          date: selectedDate,
          teacher_id: teacherId,
          student_id: studentId,
        });

        if (infoResponse.result && infoResponse.result.liaison_id) {
          setLiaisonId(infoResponse.result.liaison_id);
        } else {
          throw new Error("Impossible d'obtenir l'ID de liaison nécessaire");
        }

        setSendingStatus({ loading: false, success: false, error: "" });
      } catch (error) {
        console.error("Erreur lors de la création du document:", error);
        setSendingStatus({
          loading: false,
          success: false,
          error: "Impossible de créer le document pour attacher des fichiers",
        });
        return;
      }
    }

    try {
      const tempUrl = URL.createObjectURL(file);

      const newFile: AttachedFile = {
        name: file.name,
        url: tempUrl,
        uploading: true,
        type: file.type,
      };

      setAttachedFiles((prev) => [...prev, newFile]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result?.toString().split(",")[1];

        if (fileContent) {
          try {
            const response = await addWorkbookDocument({
              liaison_id: liaisonId,
              file_name: file.name,
              file_mime: file.type,
              file_content: fileContent,
            });

            if (response && response.status === "success") {
              setAttachedFiles((prev) =>
                prev.map((f) =>
                  f.name === file.name ? { ...f, uploading: false } : f
                )
              );

              setSendingStatus({
                loading: false,
                success: true,
                error: "",
              });

              setTimeout(() => {
                setSendingStatus({
                  loading: false,
                  success: false,
                  error: "",
                });
              }, 3000);
            } else {
              throw new Error("Échec de l'ajout du document");
            }
          } catch (error) {
            console.error("Erreur lors de l'ajout du document:", error);
            setAttachedFiles((prev) =>
              prev.filter((f) => f.name !== file.name)
            );

            setSendingStatus({
              loading: false,
              success: false,
              error: "Échec de l'ajout du document",
            });
          }
        }
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pièce jointe:", error);
      setAttachedFiles((prev) => prev.filter((f) => f.name !== file?.name));
    }
  };

  const handleViewDocument = (file: AttachedFile): void => {
    setSelectedDocument({
      name: file.name,
      url: file.url,
      mime: file.type,
    });
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = (): void => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = async (fileName: string) => {
    console.log("Début de handleDeleteDocument", {
      fileName,
      liaisonId,
      groupId,
      teacherId,
      studentId,
      date: selectedDate,
    });

    if (!liaisonId) {
      console.error("Erreur : liaisonId est manquant");
      setSendingStatus({
        loading: false,
        success: false,
        error: "Impossible de supprimer le document (liaison_id manquant)",
      });
      return;
    }

    try {
      const existingFiles = await getWorkbookContentInfo({
        group_id: Number(groupId),
        date: selectedDate,
        teacher_id: Number(teacherId),
        student_id: Number(studentId),
      });

      console.log("Contenu existant :", existingFiles);

      const normalizeFileName = (name: string) =>
        name.replace(/\s+/g, "_").replace(/\./g, "-");

      const normalizedInputFileName = normalizeFileName(fileName);

      const fileToDelete = existingFiles.result?.coUrlList?.find(
        (file) => normalizeFileName(file.name) === normalizedInputFileName
      );

      if (!fileToDelete) {
        console.error(
          `Le fichier ${fileName} n'a pas été trouvé dans la liste`,
          `Liste des fichiers : ${existingFiles.result?.coUrlList
            ?.map((f) => f.name)
            .join(", ")}`
        );
        throw new Error("Le document n'existe pas");
      }

      console.log("Fichier à supprimer :", fileToDelete);

      const deleteResponse = await deleteWorkbookDocument({
        liaison_id: liaisonId,
        file_name: fileToDelete.name,
      });

      console.log("Réponse de suppression :", deleteResponse);

      setAttachedFiles((prev) => {
        const updatedFiles = prev.filter((f) => f.name !== fileName);
        console.log("Fichiers mis à jour :", updatedFiles);
        return updatedFiles;
      });

      setDeletedFiles((prev) => {
        const updatedDeletedFiles = [...prev, fileName];
        console.log("Fichiers supprimés :", updatedDeletedFiles);
        return updatedDeletedFiles;
      });

      setSendingStatus({
        loading: false,
        success: true,
        error: "",
      });

      setTimeout(() => {
        setSendingStatus({
          loading: false,
          success: false,
          error: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Erreur complète lors de la suppression :", error);

      setSendingStatus({
        loading: false,
        success: false,
        error: `Échec de la suppression : ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
      });
    }
  };

  const loadExistingData = async (dateToLoad: string): Promise<void> => {
    if (!groupId || !teacherId || !studentId || !dateToLoad) {
      console.log("Informations manquantes pour charger les données");
      return;
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });

      const infoResponse = await getWorkbookContentInfo({
        group_id: groupId,
        date: dateToLoad,
        teacher_id: teacherId,
        student_id: studentId,
      });

      if (infoResponse.result) {
        if (infoResponse.result.liaison_id) {
          setLiaisonId(infoResponse.result.liaison_id);
        }

        if (
          infoResponse.result.liaison &&
          infoResponse.result.liaison !== "no_workbook" &&
          infoResponse.result.liaison !== "NA" &&
          infoResponse.result.liaison !== "no_liaison"
        ) {
          setMessageToParents(infoResponse.result.liaison);
        } else {
          setMessageToParents("");
        }

        if (
          infoResponse.result.homework &&
          infoResponse.result.homework !== "no_workbook" &&
          infoResponse.result.homework !== "NA" &&
          infoResponse.result.homework !== "no_liaison"
        ) {
          setHomeworkInput(infoResponse.result.homework);
        } else {
          setHomeworkInput("");
        }

        if (
          infoResponse.result.coUrlList &&
          infoResponse.result.coUrlList.length > 0
        ) {
          const files: AttachedFile[] = infoResponse.result.coUrlList.map(
            (doc) => ({
              name: doc.name,
              url: doc.coUrl,
              uploading: false,
              type: determineFileType(doc.name),
            })
          );
          setAttachedFiles(files);
        } else {
          setAttachedFiles([]);
        }
      }

      setSendingStatus({ loading: false, success: false, error: "" });
    } catch (error) {
      console.error("Erreur lors du chargement des données existantes:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Erreur lors du chargement des données",
      });
    }
  };

  useEffect(() => {
    if (selectedDate && groupId && teacherId && studentId) {
      loadExistingData(selectedDate);
    }
  }, [selectedDate, groupId, teacherId, studentId]);

  useEffect(() => {
    if (groupId && teacherId) {
      fetchAvailableDates();
    }
  }, [groupId, teacherId]);

  const determineFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
    };

    return mimeTypes[extension] || "application/octet-stream";
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-md mx-auto py-0 overflow-hidden">
      <h2 className="text-lg font-bold text-center">
        Récapitulatif de {extrairePrenom(name)}
      </h2>
      <div className="w-full my-2 flex justify-center">
        <div className="bg-gray-50 rounded-lg p-1 inline-flex">
          <div className="flex justify-center items-center">
            <div
              className={`${
                activeTab === "assiduité"
                  ? "bg-shatibi-orange text-white rounded-lg"
                  : "bg-gray-50"
              } cursor-pointer py-1 px-3 text-xs font-bold flex items-center justify-center whitespace-nowrap`}
              onClick={() => setActiveTab("assiduité")}
            >
              Assiduité
            </div>
            <span className="text-gray-300 px-1">|</span>
            <div
              className={`${
                activeTab === "Carnet de liaison"
                  ? "bg-shatibi-orange text-white rounded-lg"
                  : "bg-gray-50"
              } cursor-pointer py-1 px-1 text-xs font-bold flex items-center justify-center whitespace-nowrap`}
              onClick={() => setActiveTab("Carnet de liaison")}
            >
              Carnet de liaison
            </div>
            <span className="text-gray-300 px-1">|</span>
            <div
              className={`${
                activeTab === "Devoir indiv."
                  ? "bg-shatibi-orange text-white rounded-lg"
                  : "bg-gray-50"
              } cursor-pointer py-1 px-1 text-xs font-bold flex items-center justify-center whitespace-nowrap`}
              onClick={() => setActiveTab("Devoir indiv.")}
            >
              Devoir indiv.
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md max-h-80 overflow-y-auto mb-2">
        {activeTab === "Carnet de liaison" ? (
          <div className="w-full mb-0">
            <div className="px-4 mt-1">
              <div className="flex items-center w-full">
                <div className="flex items-center flex-shrink-0">
                  <span className="text-base font-bold mb-2 mt-2 whitespace-nowrap">
                    Choisir dates :
                  </span>
                </div>
                <div className="relative ml-auto">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    availableDates={availableDates}
                    isLoading={isLoadingDates}
                    datesWithContent={datesWithContent}
                    completeDates={completeDates}
                    emptyDates={emptyDates}
                  />
                </div>
              </div>
            </div>
            <h3 className="text-base font-bold mb-1 px-4">Carnet de liaison</h3>
            <p className="text-xs italic mb-3 px-4">
              Remontez une informations aux parents ...
            </p>
            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={messageToParents}
                  onChange={(e) => setMessageToParents(e.target.value)}
                  placeholder=""
                />
              </div>
            </div>
          </div>
        ) : activeTab === "Devoir indiv." ? (
          <div className="w-full mb-0">
            <div className="px-4 mt-1">
              <div className="flex items-center w-full">
                <div className="flex items-center flex-shrink-0">
                  <span className="text-base font-bold mb-2 mt-2 whitespace-nowrap">
                    Choisir dates :
                  </span>
                </div>
                <div className="relative ml-auto">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    availableDates={availableDates}
                    isLoading={isLoadingDates}
                    datesWithContent={datesWithContent}
                    completeDates={completeDates}
                    emptyDates={emptyDates}
                  />
                </div>
              </div>
            </div>
            <h3 className="text-base font-bold mb-1 px-4">Devoir individuel</h3>
            <p className="text-xs italic mb-3 px-4">
              Attribuez un travail à faire pour&nbsp;
              <span className="font-bold"> la séance prochaine</span>
            </p>
            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={homeworkInput}
                  onChange={(e) => setHomeworkInput(e.target.value)}
                  placeholder=""
                />
              </div>
              <div className="absolute bottom-7 right-7">
                <label
                  htmlFor="devoir-file-input"
                  className="cursor-pointer bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                >
                  <Image
                    src={PaperClip}
                    alt="Joindre un fichier"
                    width={24}
                    height={24}
                  />
                </label>
                <input
                  type="file"
                  id="devoir-file-input"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {attachedFiles.length > 0 && (
              <div className="mt-2">
                <ul className="mt-1">
                  {attachedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-xs py-1 border-b border-gray-100"
                    >
                      <span className="truncate text-blue-500 flex-grow">
                        {file.name}
                      </span>
                      <div className="flex items-center space-x-3">
                        {file.uploading ? (
                          <span className="text-gray-500">Chargement...</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleViewDocument(file)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Visualiser"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(file.name)}
                              className="text-red-500 hover:text-red-700"
                              title="Supprimer"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-4 overflow-hidden border border-[rgba(0,0,0,0.03)] shadow-sm">
              <div className="flex justify-around space-x-4 items-center">
                {[
                  {
                    name: "Abs. total",
                    number: ap + ai,
                    isPercentage: false,
                  },
                  {
                    name: "Abs. injustifiées",
                    number: ai,
                    isPercentage: false,
                  },
                  {
                    name: "Présence",
                    number: studentPercentage,
                    isPercentage: true,
                  },
                ].map(({ name, number, isPercentage }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center justify-center min-w-[80px]"
                  >
                    <span className="text-black font-semibold text-lg text-center">
                      {number}
                      {isPercentage ? " %" : ""}
                    </span>
                    <div className="text-black font-light text-xs text-center whitespace-nowrap">
                      {name}
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "assiduité" &&
                (updatedAbsencesList && updatedAbsencesList.length > 0
                  ? updatedAbsencesList
                  : absencesList
                ).length > 0 && (
                  <div className="w-full my-2">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <div className="h-px bg-gray-300 flex-grow"></div>
                      <h3 className="text-gray-400 text-sm font-semibold px-2">
                        Liste des absences
                      </h3>
                      <div className="h-px bg-gray-300 flex-grow"></div>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {(updatedAbsencesList && updatedAbsencesList.length > 0
                        ? updatedAbsencesList
                        : absencesList
                      ).map((absence, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src={calendar.src}
                              alt="Calendrier"
                              className="w-6 h-6"
                            />
                            <span className="ml-1 text-xs font-medium">
                              {absence.date
                                ? (() => {
                                    try {
                                      return formatDateWithWeekday(
                                        absence.date
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Erreur formatage date:",
                                        error
                                      );
                                      return absence.date;
                                    }
                                  })()
                                : "Date indisponible"}
                            </span>
                          </div>
                          <div
                            className={`rounded-md py-1 text-xs font-semibold text-white w-28 text-center ${
                              absence.type === "AI"
                                ? "bg-shatibi-red"
                                : "bg-shatibi-orange"
                            }`}
                          >
                            {absence.type === "AI"
                              ? "Abs. injustifiée"
                              : "Abs. prévue"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
      <div className="w-full max-w-md mt-4">
        {sendingStatus.error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-md mb-2 text-center">
            {sendingStatus.error}
          </div>
        )}

        <div className="flex justify-center">
          {activeTab === "Carnet de liaison" ? (
            <Button
              className="w-full max-w-xs py-2 rounded-full font-semibold text-lg mx-auto"
              onClick={handleSendInfo}
              variant="green"
              disabled={sendingStatus.loading}
            >
              {sendingStatus.loading
                ? "Envoi en cours..."
                : "Envoyer l'information"}
            </Button>
          ) : activeTab === "Devoir indiv." ? (
            <Button
              className="w-full max-w-xs py-2 rounded-full font-semibold text-lg mx-auto"
              onClick={handleOpenConfirmationModal}
              variant="green"
              disabled={sendingStatus.loading}
            >
              {sendingStatus.loading
                ? "Envoi en cours..."
                : "Envoyez le travail à faire"}
            </Button>
          ) : (
            <Button
              className="w-full max-w-xs py-2 rounded-full font-semibold text-lg mx-auto"
              onClick={onClickDeclarerAp}
              variant="orange"
            >
              Déclare une absence
            </Button>
          )}
        </div>
      </div>

      <DocumentViewer
        document={selectedDocument}
        isOpen={isDocumentViewerOpen}
        onClose={closeDocumentViewer}
      />
      {/* <Modal
  opened={showConfirmationModal}
  onClose={() => setShowConfirmationModal(false)}
  size="lg"
  withCloseButton={false}
  radius="lg"
  centered
>
  <Confirmation
    onConfirm={handleSendHomework}
    onCancel={() => setShowConfirmationModal(false)}
  />
</Modal> */}
    </div>
  );
};

export default StudentGroupStats;
