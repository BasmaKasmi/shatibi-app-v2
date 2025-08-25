"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeacher } from "@/app/TeacherContext";
import { extrairePrenom } from "@/lib/format-utils";
import PaperClip from "@/public/assets/Paperclip.svg";
import Image from "next/image";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import {
  setWorkbookContent,
  addWorkbookDocument,
  deleteWorkbookDocument,
  getWorkbookContentInfo,
} from "@/api/index";
import DocumentViewer from "@/components/DocumentViewer";
import { Modal } from "@mantine/core";
import Confirmation from "@/components/Confirmation";

export interface ClassWorkProps {
  name: string;
  groupId: number;
  teacherId: number;
  studentId: number;
  date: string;
  onComplete?: () => void;
}

interface AttachedFile {
  name: string;
  url: string;
  uploading: boolean;
  type?: string;
  isTemporary?: boolean;
}

interface ViewableDocument {
  name: string;
  url: string;
  mime?: string;
}

interface WorkbookDocumentResponse {
  status: string;
  result?: {
    coUrlList?: Array<{
      name: string;
      coUrl: string;
    }>;
  };
}

export const Correspondence = ({
  name,
  studentId,
  date,
  onComplete,
}: ClassWorkProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Carnet de liaison");
  const [resumeCours, setResumeCours] = useState("");
  const [devoirIndividual, setDevoirIndividual] = useState("");
  const [sendingStatus, setSendingStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [liaisonId, setLiaisonId] = useState<number>(0);
  const [
    showValidateWithoutHomeworkModal,
    setShowValidateWithoutHomeworkModal,
  ] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);
  const [deletingFiles, setDeletingFiles] = useState<string[]>([]);

  const search = useSearchParams();
  const mode = search.get("mode") || "liaison";
  const teacherContext = useTeacher();
  const teacherId = teacherContext?.teacherId;
  const groupId = Number(search.get("groupId") || "0");
  const [dateToUse, setDateToUse] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [liaisonTextareaFocused, setLiaisonTextareaFocused] = useState(false);
  const [devoirTextareaFocused, setDevoirTextareaFocused] = useState(false);
  const [apiDate, setApiDate] = useState<string>("");

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    setDateToUse(date);
    console.log("Date utilisée dans Correspondence:", date);
  }, [date]);

  useEffect(() => {
    if (date) {
      setDateToUse(date);
      console.log("Date reçue dans Correspondence:", date);
    } else {
      const storedDate = localStorage.getItem("selectedWorkbookDate");
      if (storedDate) {
        console.log(
          "Utilisation de la date stockée en localStorage:",
          storedDate
        );
        setDateToUse(storedDate);
      } else {
        console.log("Aucune date disponible pour la correspondance");
      }
    }
  }, [date]);

  const handleOpenConfirmationModal = () => {
    if (!devoirIndividual.trim() && attachedFiles.length === 0) {
      alert(
        "Veuillez saisir un Devoir individuel ou joindre au moins un document"
      );
      return;
    }

    if (!groupId || !teacherId || !studentId || !dateToUse) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    setShowConfirmationModal(true);
  };

  useEffect(() => {
    if (mode === "homework") {
      setActiveTab("Devoir individuel");
    } else {
      setActiveTab("Carnet de liaison");
    }
  }, [mode]);

  const handleSubmitLiaison = async (): Promise<void> => {
    if (!groupId || !teacherId || !studentId || !dateToUse) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    if (onComplete) {
      onComplete();
    }

    try {
      setShowValidateWithoutHomeworkModal(false);
      setSendingStatus({ loading: true, success: false, error: "" });

      if (liaisonId) {
        console.log(
          `Mise à jour du carnet de liaison avec liaison_id: ${liaisonId}`
        );
      } else {
        console.log("Création d'un nouveau carnet de liaison");
      }

      let homeworkToSend = "";

      if (devoirIndividual.trim()) {
        homeworkToSend = devoirIndividual;
      } else if (liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: dateToUse,
            student_id: studentId,
          });

          if (
            infoResponse.result &&
            infoResponse.result.homework &&
            infoResponse.result.homework !== "no_liaison" &&
            infoResponse.result.homework !== "NA"
          ) {
            homeworkToSend = infoResponse.result.homework;
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du devoir existant:",
            error
          );
        }
      }

      const response = await setWorkbookContent({
        group_id: groupId,
        date: dateToUse,
        teacher_id: teacherId,
        student_id: studentId,
        liaison: resumeCours,
        homework: homeworkToSend,
      });

      console.log("Réponse envoi carnet de liaison et devoir:", response);

      if (!liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: dateToUse,
            student_id: studentId,
          });

          if (infoResponse.result && infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
            console.log(
              "Nouveau liaison_id obtenu:",
              infoResponse.result.liaison_id
            );
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du liaison_id:", error);
        }
      }

      setSendingStatus({ loading: false, success: true, error: "" });

      setTimeout(() => {
        setSendingStatus({ loading: false, success: false, error: "" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du carnet de liaison:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  const handleSendDevoir = async (): Promise<void> => {
    if (!devoirIndividual.trim() && attachedFiles.length === 0) {
      alert(
        "Veuillez saisir un Devoir individuel ou joindre au moins un document"
      );
      return;
    }

    if (!groupId || !teacherId || !studentId || !dateToUse) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    if (onComplete) {
      onComplete();
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });

      if (liaisonId) {
        console.log(`Mise à jour du devoir avec liaison_id: ${liaisonId}`);
      } else {
        console.log("Création d'un nouveau devoir");
      }

      let currentLiaison = "";
      if (liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: dateToUse,
            student_id: studentId,
          });

          if (
            infoResponse.result &&
            infoResponse.result.liaison &&
            infoResponse.result.liaison !== "no_liaison" &&
            infoResponse.result.liaison !== "NA"
          ) {
            currentLiaison = infoResponse.result.liaison;
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de la liaison existante:",
            error
          );
        }
      }

      const response = await setWorkbookContent({
        group_id: groupId,
        date: dateToUse,
        teacher_id: teacherId,
        student_id: studentId,
        liaison: currentLiaison,
        homework: devoirIndividual,
      });

      console.log("Réponse envoi devoir:", response);

      if (!liaisonId) {
        try {
          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: dateToUse,
            student_id: studentId,
          });

          if (infoResponse.result && infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
            console.log(
              "Nouveau liaison_id obtenu:",
              infoResponse.result.liaison_id
            );
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du liaison_id:", error);
        }
      }

      setSendingStatus({ loading: false, success: false, error: "" });

      const docsMessage =
        attachedFiles.length > 0
          ? ` avec ${attachedFiles.length} document(s) joint(s)`
          : "";
      console.log(`Devoir individuel envoyé avec succès${docsMessage}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi du devoir individuel:", error);
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

    const existingFileIndex = attachedFiles.findIndex(
      (f) => f.name === file.name
    );
    if (existingFileIndex !== -1) {
      alert(
        `Un fichier nommé "${file.name}" existe déjà. Veuillez renommer votre fichier avant de l'ajouter.`
      );
      e.target.value = "";
      return;
    }

    if (!teacherId) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Identifiant enseignant manquant",
      });
      return;
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });

      let currentLiaisonId = liaisonId;
      if (!currentLiaisonId) {
        if (!groupId || !studentId || !dateToUse) {
          throw new Error("Informations manquantes pour créer le devoir");
        }

        console.log("Création d'un devoir pour attacher des fichiers...");

        const response = await setWorkbookContent({
          group_id: groupId,
          date: dateToUse,
          teacher_id: teacherId,
          student_id: studentId,
          liaison: "",
          homework: devoirIndividual || " ",
        });

        console.log("Réponse création devoir:", response);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const infoResponse = await getWorkbookContentInfo({
          group_id: groupId,
          date: dateToUse,
          teacher_id: teacherId,
          student_id: studentId,
        });

        if (infoResponse.result && infoResponse.result.liaison_id) {
          currentLiaisonId = infoResponse.result.liaison_id;
          setLiaisonId(currentLiaisonId);
          console.log("Nouveau liaison_id obtenu:", currentLiaisonId);
        } else {
          throw new Error("Impossible d'obtenir l'ID de liaison nécessaire");
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const tempUrl = URL.createObjectURL(file);
      const newFile: AttachedFile = {
        name: file.name,
        url: tempUrl,
        uploading: true,
        type: file.type,
        isTemporary: true,
      };
      setAttachedFiles((prev) => [...prev, newFile]);
      console.log(
        `Ajout du fichier ${file.name} avec liaison_id: ${currentLiaisonId}`
      );

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result?.toString().split(",")[1];

        if (fileContent) {
          try {
            const response = await addWorkbookDocument({
              liaison_id: currentLiaisonId,
              file_name: file.name,
              file_mime: file.type,
              file_content: fileContent,
            });

            console.log("Réponse ajout document:", response);

            if (response && response.status === "success") {
              setAttachedFiles((prev) =>
                prev.map((f) =>
                  f.name === file.name
                    ? { ...f, uploading: false, isTemporary: false }
                    : f
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
      setSendingStatus({ loading: false, success: false, error: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pièce jointe:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'ajout du document",
      });
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
      date,
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
        date: date,
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

  useEffect(() => {
    const loadExistingData = async (): Promise<void> => {
      if (!groupId || !teacherId || !studentId || !dateToUse) {
        console.log("Informations manquantes pour charger les données");
        return;
      }

      try {
        console.log("Chargement des données existantes...", {
          group_id: groupId,
          teacher_id: teacherId,
          student_id: studentId,
          date: dateToUse,
        });

        const infoResponse = await getWorkbookContentInfo({
          group_id: groupId,
          date: dateToUse,
          teacher_id: teacherId,
          student_id: studentId,
        });

        console.log("Réponse API getWorkbookContentInfo:", infoResponse);

        if (infoResponse.result) {
          if (infoResponse.result.date) {
            setApiDate(infoResponse.result.date);
            console.log("Date récupérée de l'API:", infoResponse.result.date);
          }
          if (infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
          }

          if (
            infoResponse.result.liaison &&
            infoResponse.result.liaison !== "no_liaison" &&
            infoResponse.result.liaison !== "NA"
          ) {
            setResumeCours(infoResponse.result.liaison);
          } else {
            setResumeCours("");
          }

          if (
            infoResponse.result.homework &&
            infoResponse.result.homework !== "no_liaison" &&
            infoResponse.result.homework !== "NA"
          ) {
            setDevoirIndividual(infoResponse.result.homework);
          } else {
            setDevoirIndividual("");
          }

          if (
            infoResponse.result.coUrlList &&
            infoResponse.result.coUrlList.length > 0
          ) {
            const uniqueFiles = [];
            const fileNames = new Set();

            for (const doc of infoResponse.result.coUrlList) {
              if (
                !fileNames.has(doc.name) &&
                !deletedFiles.includes(doc.name)
              ) {
                fileNames.add(doc.name);
                uniqueFiles.push({
                  name: doc.name,
                  url: doc.coUrl,
                  uploading: false,
                  type: determineFileType(doc.name),
                  isTemporary: false,
                });
              }
            }

            setAttachedFiles(uniqueFiles);
            console.log("Documents uniques chargés:", uniqueFiles.length);
          }

          console.log("Données chargées avec succès:", infoResponse.result);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données existantes:",
          error
        );
      }
    };

    loadExistingData();
  }, [groupId, teacherId, studentId, dateToUse, deletedFiles]);

  useEffect(() => {
    const storageKey = `deletedFiles_${studentId}_${dateToUse}`;
    const storedDeletedFiles = localStorage.getItem(storageKey);

    if (storedDeletedFiles) {
      try {
        const parsedDeletedFiles = JSON.parse(storedDeletedFiles);
        setDeletedFiles(parsedDeletedFiles);
        console.log(
          "Fichiers supprimés chargés depuis localStorage:",
          parsedDeletedFiles
        );
      } catch (e) {
        console.error("Erreur lors du chargement des fichiers supprimés:", e);
      }
    }
  }, [studentId, dateToUse]);

  useEffect(() => {
    if (deletedFiles.length > 0 && studentId && dateToUse) {
      const storageKey = `deletedFiles_${studentId}_${dateToUse}`;
      localStorage.setItem(storageKey, JSON.stringify(deletedFiles));
      console.log(
        "Fichiers supprimés enregistrés dans localStorage:",
        deletedFiles
      );
    }
  }, [deletedFiles, studentId, dateToUse]);

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

  const handleSendBothFixed = async (): Promise<void> => {
    if (!devoirIndividual.trim() && attachedFiles.length === 0) {
      alert(
        "Veuillez saisir un Devoir individuel ou joindre au moins un document"
      );
      return;
    }

    if (!groupId || !teacherId || !studentId || !dateToUse) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    if (onComplete) {
      onComplete();
    }

    try {
      setSendingStatus({ loading: true, success: false, error: "" });
      console.log(
        "Fichiers supprimés qui ne seront pas restaurés:",
        deletedFiles
      );

      if (liaisonId) {
        for (const fileName of deletedFiles) {
          try {
            const fileExists = attachedFiles.some(
              (file) => file.name === fileName
            );

            if (!fileExists) {
              await deleteWorkbookDocument({
                liaison_id: liaisonId,
                file_name: fileName,
              });
              console.log(
                `Suppression du fichier ${fileName} confirmée lors de l'envoi`
              );
            }
          } catch (error) {
            console.error(
              `Erreur lors de la suppression du fichier ${fileName}:`,
              error
            );
          }
        }
      }

      if (!liaisonId) {
        try {
          const response = await setWorkbookContent({
            group_id: groupId,
            date: dateToUse,
            teacher_id: teacherId,
            student_id: studentId,
            liaison: resumeCours || " ",
            homework: devoirIndividual || " ",
          });

          const infoResponse = await getWorkbookContentInfo({
            group_id: groupId,
            teacher_id: teacherId,
            date: dateToUse,
            student_id: studentId,
          });

          if (infoResponse.result && infoResponse.result.liaison_id) {
            setLiaisonId(infoResponse.result.liaison_id);
          }
        } catch (error) {
          console.error("Erreur lors de la création initiale:", error);
          setSendingStatus({
            loading: false,
            success: false,
            error: "Échec de l'opération. Veuillez réessayer.",
          });
          return;
        }
      } else {
        const response = await setWorkbookContent({
          group_id: groupId,
          date: dateToUse,
          teacher_id: teacherId,
          student_id: studentId,
          liaison: resumeCours,
          homework: devoirIndividual,
        });

        console.log("Réponse envoi combiné:", response);
      }

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
      console.error("Erreur lors de l'envoi combiné:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  useEffect(() => {
    setDeletedFiles([]);

    const keysToCheck = Object.keys(localStorage);
    const oldDeletedFilesKeys = keysToCheck.filter(
      (key) =>
        key.startsWith("deletedFiles_") &&
        !key.includes(`_${studentId}_${dateToUse}`)
    );

    if (oldDeletedFilesKeys.length > 10) {
      oldDeletedFilesKeys.forEach((key) => localStorage.removeItem(key));
      console.log(
        "Nettoyage des anciennes entrées de fichiers supprimés dans localStorage"
      );
    }
  }, [studentId, dateToUse]);

  const handleOpenConfirmationModalForLiaison = () => {
    if (!resumeCours.trim()) {
      alert("Veuillez saisir un carnet de liaison");
      return;
    }

    if (!groupId || !teacherId || !studentId || !dateToUse) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    setShowConfirmationModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-md mx-auto py-0 overflow-hidden">
      <div className="text-center">
        <h2 className="text-lg font-bold">
          Correspondance de {extrairePrenom(name)}
        </h2>
        {apiDate && (
          <p className="text-sm font-semibold mt-1">
            Séance du {formatDate(apiDate)}
          </p>
        )}
      </div>
      <div className="w-full my-2 flex justify-center">
        <div className="bg-gray-50 rounded-lg p-1 inline-flex">
          <div className="flex justify-center items-center">
            <div
              className={`${
                activeTab === "Carnet de liaison"
                  ? "bg-shatibi-orange text-white"
                  : "bg-white"
              } cursor-pointer py-1 px-3 text-xs font-bold flex items-center justify-center whitespace-nowrap rounded-lg`}
              onClick={() => setActiveTab("Carnet de liaison")}
            >
              Carnet de liaison
            </div>
            <span className="text-gray-400 px-0.5">|</span>
            <div
              className={`${
                activeTab === "Devoir individuel"
                  ? "bg-shatibi-orange text-white"
                  : "bg-white"
              } cursor-pointer py-1 px-3 text-xs font-bold flex items-center justify-center whitespace-nowrap rounded-lg`}
              onClick={() => setActiveTab("Devoir individuel")}
            >
              Devoir individuel
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md max-h-80 overflow-y-auto">
        {activeTab === "Carnet de liaison" ? (
          <div className="w-full mb-0">
            <h3 className="text-base font-bold mb-1 px-4">Carnet de liaison</h3>
            <p className="text-xs italic mb-3 px-4">
              Remontez une informations aux parents ...
            </p>
            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={resumeCours}
                  onChange={(e) => setResumeCours(e.target.value)}
                  onFocus={() => setLiaisonTextareaFocused(true)}
                  onBlur={() => setLiaisonTextareaFocused(false)}
                  placeholder=""
                  autoComplete={liaisonTextareaFocused ? "on" : "off"}
                  autoCorrect={liaisonTextareaFocused ? "on" : "off"}
                  autoCapitalize={liaisonTextareaFocused ? "sentences" : "off"}
                  spellCheck={liaisonTextareaFocused}
                  data-gramm={liaisonTextareaFocused ? "true" : "false"}
                  data-gramm_editor={liaisonTextareaFocused ? "true" : "false"}
                  data-enable-grammarly={
                    liaisonTextareaFocused ? "true" : "false"
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mb-0">
            <h3 className="text-base font-bold mb-1 px-4">Devoir individuel</h3>
            <p className="text-xs italic mb-3 px-4">
              Attribuez un travail à faire pour&nbsp;
              <span className="font-bold"> la séance prochaine</span>
            </p>
            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={devoirIndividual}
                  onChange={(e) => setDevoirIndividual(e.target.value)}
                  onFocus={() => setDevoirTextareaFocused(true)}
                  onBlur={() => setDevoirTextareaFocused(false)}
                  placeholder=""
                  autoComplete={devoirTextareaFocused ? "on" : "off"}
                  autoCorrect={devoirTextareaFocused ? "on" : "off"}
                  autoCapitalize={devoirTextareaFocused ? "sentences" : "off"}
                  spellCheck={devoirTextareaFocused}
                  data-gramm={devoirTextareaFocused ? "true" : "false"}
                  data-gramm_editor={devoirTextareaFocused ? "true" : "false"}
                  data-enable-grammarly={
                    devoirTextareaFocused ? "true" : "false"
                  }
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
                        {file.uploading || deletingFiles.includes(file.name) ? (
                          <span className="text-gray-500">
                            {file.uploading
                              ? "Chargement..."
                              : "Suppression..."}
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleViewDocument(file)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Visualiser"
                              type="button"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteDocument(file.name);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Supprimer"
                              disabled={deletingFiles.includes(file.name)}
                              type="button"
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
        )}
      </div>
      <div>
        <div className="w-full mt-4 mb-2">
          {activeTab === "Carnet de liaison" ? (
            <Button
              className="w-full py-3 text-black border border-black bg-white rounded-full font-bold"
              onClick={() => setActiveTab("Devoir individuel")}
              variant="black"
            >
              Ajouter un devoir individuel
            </Button>
          ) : (
            <Button
              className="w-full py-3 text-black border border-black bg-white rounded-full font-bold"
              onClick={() => setActiveTab("Carnet de liaison")}
              variant="black"
            >
              Ajouter une information
            </Button>
          )}
        </div>
        {sendingStatus.success ? null : null}
        {sendingStatus.error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-md mb-2 text-center">
            {sendingStatus.error}
          </div>
        )}

        {activeTab === "Carnet de liaison" ? (
          <Button
            className="w-full py-3 text-shatibi-green bg-shatibi-green/[.15] rounded-full font-bold"
            onClick={handleOpenConfirmationModalForLiaison}
            variant="green"
            disabled={sendingStatus.loading}
          >
            {sendingStatus.loading
              ? "Envoi en cours..."
              : "Envoyer la correspondance"}
          </Button>
        ) : (
          <Button
            className="w-full py-3 text-shatibi-green bg-shatibi-green/[.15] rounded-full font-bold"
            onClick={handleOpenConfirmationModal}
            variant="green"
            disabled={sendingStatus.loading}
          >
            {sendingStatus.loading
              ? "Envoi en cours..."
              : "Envoyer la correspondance"}
          </Button>
        )}
      </div>

      <DocumentViewer
        document={selectedDocument}
        isOpen={isDocumentViewerOpen}
        onClose={closeDocumentViewer}
      />
      <Modal
        opened={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        size="lg"
        withCloseButton={false}
        radius="lg"
        centered
      >
        <Confirmation
          onConfirm={
            activeTab === "Carnet de liaison"
              ? handleSubmitLiaison
              : handleSendBothFixed
          }
          onCancel={() => setShowConfirmationModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Correspondence;
