"use client";
import { useEffect, useState } from "react";
import PaperClip from "@/public/assets/Paperclip.svg";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Button from "@/components/Button";
import {
  fetchWorkbookSessionInfo,
  WorkbookSessionDocument,
  ValidationPayloadWithFiles,
  validateCahierSeance,
  AddDocumentPayload,
} from "@/api/index";
import { useAddDocument, useDeleteDocument } from "@/app/Mutations";
import { useRouter, useSearchParams } from "next/navigation";
import { useTeacher } from "@/app/TeacherContext";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";
import { decodeHtml } from "@/lib/format-utils";
import ValidateWithoutHomework from "@/components/ValidateWithoutHomework";
import { Modal } from "@mantine/core";
import DocumentViewer from "@/components/DocumentViewer";
import CdsConfirmation from "@/components/CdsConfirmation";

export type ClassWorkTabMode = "resume" | "devoir";

export interface ClassWorkProps {
  name: string;
  groupId: number;
  teacherId: number;
  studentId: number;
  date: string;
  workbookId?: number;
  onComplete?: () => void;
  defaultTab?: ClassWorkTabMode;
}

export const ClassWork = ({
  name,
  studentId,
  date,
  workbookId,
  onComplete,
  defaultTab = "resume",
}: ClassWorkProps) => {
  const [resumeCours, setResumeCours] = useState("");
  const [devoirCollectif, setDevoirCollectif] = useState("");
  const [sendingStatus, setSendingStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [
    showValidateWithoutHomeworkModal,
    setShowValidateWithoutHomeworkModal,
  ] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  const router = useRouter();
  const [courseSummary, setCourseSummary] = useState("");
  const [homework, setHomework] = useState("");
  const [abUrlList, setAbUrlList] = useState<WorkbookSessionDocument[]>([]);
  const [hwUrlList, setHwUrlList] = useState<WorkbookSessionDocument[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showCdsConfirmationModal, setShowCdsConfirmationModal] =
    useState(false);
  const [resumeTextareaFocused, setResumeTextareaFocused] = useState(false);
  const [devoirTextareaFocused, setDevoirTextareaFocused] = useState(false);

  interface ViewableDocument {
    name: string;
    url: string;
    mime?: string;
  }

  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);

  const search = useSearchParams();
  const teacherContext = useTeacher();
  const teacherId = teacherContext?.teacherId;
  const groupId = Number(search.get("groupId") || "0");
  const dateToUse = date || search.get("date") || "";

  const fromWeeksPage = search.get("fromWeeksPage") === "true";
  const fromResumeWeeksPage = search.get("fromResumeWeeksPage") === "true";
  const urlDefaultTab = search.get("defaultTab");
  const currentPath = window.location.pathname;
  const isResumeOnlyMode =
    fromResumeWeeksPage || currentPath.includes("/resume-weeks");

  const isDevoirOnlyMode = fromWeeksPage || currentPath.includes("/weeks-page");

  const getDefaultTab = () => {
    if (fromResumeWeeksPage) {
      return "Résumé du cours";
    }

    if (fromWeeksPage) {
      return "Devoir collectif";
    }

    if (urlDefaultTab === "devoir") {
      return "Devoir collectif";
    }
    if (urlDefaultTab === "resume") {
      return "Résumé du cours";
    }

    const result =
      defaultTab === "devoir" ? "Devoir collectif" : "Résumé du cours";
    return result;
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: workbookSessionInfoResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, dateToUse],
    queryFn: () => fetchWorkbookSessionInfo(teacherId!, groupId!, dateToUse),
    enabled: !!teacherId && !!groupId && !!dateToUse,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const addDocumentMutation = useAddDocument(
    teacherId!,
    groupId,
    dateToUse,
    setAbUrlList,
    setHwUrlList
  );

  const deleteDocumentMutation = useDeleteDocument(
    teacherId!,
    groupId,
    dateToUse,
    setAbUrlList,
    setHwUrlList
  );

  useEffect(() => {
    const result = workbookSessionInfoResponse?.result;
    console.log("Résultat de l'API:", result);

    if (result) {
      const session = Array.isArray(result) ? result[0] : result;
      console.log("Session après traitement:", session);

      if (session) {
        const abstract = decodeHtml(session.abstract || "");
        const homeworkContent = decodeHtml(session.homework || "");

        setCourseSummary(
          abstract === "no_workbook" || abstract === "NA" ? "" : abstract
        );
        setHomework(
          homeworkContent === "no_workbook" || homeworkContent === "NA"
            ? ""
            : homeworkContent
        );

        if (session.abUrlList && Array.isArray(session.abUrlList)) {
          console.log(
            "Documents résumé trouvés dans l'API:",
            session.abUrlList
          );
          setAbUrlList(session.abUrlList);
        }

        if (session.hwUrlList && Array.isArray(session.hwUrlList)) {
          console.log(
            "Documents devoir trouvés dans l'API:",
            session.hwUrlList
          );
          setHwUrlList(session.hwUrlList);
        }

        if (abstract && abstract !== "no_workbook" && abstract !== "NA") {
          setResumeCours(abstract);
        }

        if (
          homeworkContent &&
          homeworkContent !== "no_workbook" &&
          homeworkContent !== "NA"
        ) {
          setDevoirCollectif(homeworkContent);
        }

        if (session.abUrlList) {
          localStorage.setItem(
            `abUrlList_${teacherId}_${dateToUse}`,
            JSON.stringify(session.abUrlList)
          );
        }

        if (session.hwUrlList) {
          localStorage.setItem(
            `hwUrlList_${teacherId}_${dateToUse}`,
            JSON.stringify(session.hwUrlList)
          );
        }
      }

      setDataInitialized(true);
    }
  }, [workbookSessionInfoResponse, teacherId, dateToUse]);

  useEffect(() => {
    if (dataInitialized) return;

    const savedAbstract = localStorage.getItem(
      `abstract_${teacherId}_${dateToUse}`
    );
    const savedHomework = localStorage.getItem(
      `homework_${teacherId}_${dateToUse}`
    );
    const savedAbUrlList = localStorage.getItem(
      `abUrlList_${teacherId}_${dateToUse}`
    );
    const savedHwUrlList = localStorage.getItem(
      `hwUrlList_${teacherId}_${dateToUse}`
    );

    let dataLoaded = false;

    if (savedAbstract) {
      const abstract = decodeHtml(savedAbstract);
      setCourseSummary(
        abstract === "no_workbook" || abstract === "NA" ? "" : abstract
      );
      setResumeCours(
        abstract === "no_workbook" || abstract === "NA" ? "" : abstract
      );
      dataLoaded = true;
    }

    if (savedHomework) {
      const homeworkContent = decodeHtml(savedHomework);
      setHomework(
        homeworkContent === "no_workbook" || homeworkContent === "NA"
          ? ""
          : homeworkContent
      );
      setDevoirCollectif(
        homeworkContent === "no_workbook" || homeworkContent === "NA"
          ? ""
          : homeworkContent
      );
      dataLoaded = true;
    }

    if (savedAbUrlList) {
      try {
        setAbUrlList(JSON.parse(savedAbUrlList));
        dataLoaded = true;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des documents depuis le localStorage:",
          error
        );
      }
    }

    if (savedHwUrlList) {
      try {
        setHwUrlList(JSON.parse(savedHwUrlList));
        dataLoaded = true;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des documents depuis le localStorage:",
          error
        );
      }
    }

    if (dataLoaded) {
      setDataInitialized(true);
    }
  }, [teacherId, dateToUse, dataInitialized]);

  useEffect(() => {
    if (resumeCours && resumeCours !== "no_workbook" && resumeCours !== "NA") {
      localStorage.setItem(`abstract_${teacherId}_${dateToUse}`, resumeCours);
    }

    if (
      devoirCollectif &&
      devoirCollectif !== "no_workbook" &&
      devoirCollectif !== "NA"
    ) {
      localStorage.setItem(
        `homework_${teacherId}_${dateToUse}`,
        devoirCollectif
      );
    }

    if (abUrlList.length) {
      localStorage.setItem(
        `abUrlList_${teacherId}_${dateToUse}`,
        JSON.stringify(abUrlList)
      );
    }

    if (hwUrlList.length) {
      localStorage.setItem(
        `hwUrlList_${teacherId}_${dateToUse}`,
        JSON.stringify(hwUrlList)
      );
    }
  }, [
    resumeCours,
    devoirCollectif,
    abUrlList,
    hwUrlList,
    teacherId,
    dateToUse,
  ]);

  const handleViewDocument = (doc: WorkbookSessionDocument): void => {
    console.log("Ouverture du document pour visualisation:", doc);

    let url = doc.url;

    if (typeof url === "string" && url.includes("\\")) {
      url = url.replace(/\\/g, "");
    }

    const isTempUrl = url.startsWith("blob:");

    const viewableDoc: ViewableDocument = {
      name: doc.name,
      url: url,
      mime:
        doc.mime ||
        (doc as any).mime ||
        (doc.name.endsWith(".png") ||
        doc.name.endsWith(".jpg") ||
        doc.name.endsWith(".jpeg")
          ? "image/" + doc.name.split(".").pop()
          : "application/octet-stream"),
    };

    console.log("Document préparé pour visualisation:", viewableDoc);

    setSelectedDocument(viewableDoc);
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = (): void => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "devoir"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log("Début du téléchargement du fichier:", file.name);

      const tempUrl = URL.createObjectURL(file);
      const newDoc: WorkbookSessionDocument = {
        name: file.name,
        url: tempUrl,
        mime: file.type,
      };

      if (type === "resume") {
        setAbUrlList((prev) => [...prev, newDoc]);
      } else {
        setHwUrlList((prev) => [...prev, newDoc]);
      }

      const fileType: "ab" | "hw" = type === "resume" ? "ab" : "hw";

      const payload: Omit<AddDocumentPayload, "file_content"> = {
        id: workbookId || Number(search.get("pageId") || "0"),
        file_name: file.name,
        file_mime: file.type,
        file_type: fileType,
      };

      e.target.value = "";

      await addDocumentMutation.mutateAsync(
        { file, payload },
        {
          onSuccess: () => {
            console.log("Document ajouté avec succès");
          },
          onError: (error) => {
            console.error("Erreur lors de l'ajout du document:", error);
            if (type === "resume") {
              setAbUrlList((prev) => prev.filter((doc) => doc.url !== tempUrl));
            } else {
              setHwUrlList((prev) => prev.filter((doc) => doc.url !== tempUrl));
            }
            alert(`Erreur lors de l'ajout du document: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error(`Erreur lors de l'ajout du document:`, error);
      alert(`Erreur lors de l'ajout du document. Veuillez réessayer.`);
    }
  };

  const handleDeleteDocument = (
    fileName: string,
    fileType: "resume" | "devoir"
  ) => {
    console.log("Suppression du document avec workbookId:", workbookId);
    console.log("Suppression du document:", fileName, "de type:", fileType);

    deleteDocumentMutation.mutate({
      id: workbookId || Number(search.get("pageId") || "0"),
      file_name: fileName,
      file_type: fileType === "resume" ? "ab" : "hw",
    });
  };

  const handleSendResume = () => {
    if (!resumeCours.trim()) {
      alert("Veuillez saisir un résumé du cours");
      return;
    }

    if (devoirCollectif && devoirCollectif.trim().length > 0) {
      setShowCdsConfirmationModal(true);
    } else {
      setShowValidateWithoutHomeworkModal(true);
    }
  };

  const closeValidateWithoutHomeworkModal = () => {
    setShowValidateWithoutHomeworkModal(false);
  };

  const handleSubmitWorkbook = async () => {
    if (
      !groupId ||
      !teacherId ||
      studentId === undefined ||
      studentId === null ||
      !dateToUse
    ) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    try {
      setShowValidateWithoutHomeworkModal(false);
      setSendingStatus({
        loading: true,
        success: false,
        error: "",
      });

      const abstract = activeTab === "Résumé du cours" ? resumeCours : "";
      const homework = activeTab === "Devoir collectif" ? devoirCollectif : "";

      const payload: ValidationPayloadWithFiles = {
        group_id: groupId.toString(),
        teacher_id: teacherId,
        date: dateToUse,
        abstract: abstract,
        homework: homework,
      };

      const response = await validateCahierSeance(payload);

      setSendingStatus({
        loading: false,
        success: true,
        error: "",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  const handleSwitchTab = (tab: "Résumé du cours" | "Devoir collectif") => {
    setActiveTab(tab);
  };

  const handleSendBothConfirmed = async () => {
    setShowCdsConfirmationModal(false);

    if (activeTab === "Devoir collectif" && !devoirCollectif.trim()) {
      alert("Veuillez saisir un devoir collectif");
      return;
    }

    if (
      !groupId ||
      !teacherId ||
      studentId === undefined ||
      studentId === null ||
      !dateToUse
    ) {
      setSendingStatus({
        loading: false,
        success: false,
        error: "Informations manquantes pour l'envoi",
      });
      return;
    }

    try {
      setSendingStatus({
        loading: true,
        success: false,
        error: "",
      });

      const payload: ValidationPayloadWithFiles = {
        group_id: groupId.toString(),
        teacher_id: teacherId,
        date: dateToUse,
        abstract: resumeCours.trim() || "",
        homework: devoirCollectif.trim() || "",
      };

      await validateCahierSeance(payload);

      setSendingStatus({
        loading: false,
        success: true,
        error: "",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSendingStatus({
        loading: false,
        success: false,
        error: "Échec de l'envoi. Veuillez réessayer.",
      });
    }
  };

  const handleSendBoth = () => {
    if (!devoirCollectif.trim()) {
      alert("Veuillez saisir un devoir collectif");
      return;
    }

    console.log("handleSendBoth called, setting modal to true");
    setShowCdsConfirmationModal(true);
  };

  const closeCdsConfirmationModal = () => {
    setShowCdsConfirmationModal(false);
  };

  useEffect(() => {
    console.log("abUrlList a changé:", abUrlList);
  }, [abUrlList]);

  useEffect(() => {
    console.log("hwUrlList a changé:", hwUrlList);
  }, [hwUrlList]);

  if (isLoading)
    return <p className="text-center py-4">Chargement des données...</p>;
  if (error)
    return (
      <p className="text-center py-4 text-red-500">
        Erreur lors du chargement des données.
      </p>
    );

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-md mx-auto py-0 overflow-hidden">
      <h2 className="text-lg font-bold text-center">
        {isResumeOnlyMode
          ? "Résumé du cours"
          : isDevoirOnlyMode
          ? "Devoir collectif"
          : "Cahier de séance"}
      </h2>
      <p className="text-center text-sm font-semibold mb-2">
        Séance du&nbsp;
        {dateToUse
          ? new Date(dateToUse).toLocaleDateString("fr-FR")
          : "Date non disponible"}
      </p>
      {!isResumeOnlyMode && !isDevoirOnlyMode && (
        <div className="w-full my-2 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-1 inline-flex w-[90%]">
            <div className="flex justify-center items-center w-full">
              <div
                className={`${
                  activeTab === "Résumé du cours"
                    ? "bg-shatibi-orange text-white"
                    : "bg-white"
                } cursor-pointer py-1 px-3 text-xs font-bold flex items-center justify-center whitespace-nowrap rounded-lg`}
                onClick={() => setActiveTab("Résumé du cours")}
              >
                Résumé du cours
              </div>
              <span className="text-gray-400 px-0.5">|</span>
              <div
                className={`${
                  activeTab === "Devoir collectif"
                    ? "bg-shatibi-orange text-white"
                    : "bg-white"
                } cursor-pointer py-1 px-3 text-xs font-bold flex items-center justify-center whitespace-nowrap rounded-lg`}
                onClick={() => setActiveTab("Devoir collectif")}
              >
                Devoir collectif
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-md max-h-80 overflow-y-auto">
        {(isResumeOnlyMode || activeTab === "Résumé du cours") &&
        !isDevoirOnlyMode ? (
          <div className="w-full mb-0">
            <h3 className="text-base font-bold mb-1 px-4">
              Ajouter un résumé du cours
            </h3>
            <p className="text-xs italic mb-3 px-4">
              Résumez les principaux sujets traités pendant le cours
            </p>

            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={resumeCours}
                  onChange={(e) => setResumeCours(e.target.value)}
                  onFocus={() => setResumeTextareaFocused(true)}
                  onBlur={() => setResumeTextareaFocused(false)}
                  placeholder=""
                  autoComplete={resumeTextareaFocused ? "on" : "off"}
                  autoCorrect={resumeTextareaFocused ? "on" : "off"}
                  autoCapitalize={resumeTextareaFocused ? "sentences" : "off"}
                  spellCheck={resumeTextareaFocused}
                  data-gramm={resumeTextareaFocused ? "true" : "false"}
                  data-gramm_editor={resumeTextareaFocused ? "true" : "false"}
                  data-enable-grammarly={
                    resumeTextareaFocused ? "true" : "false"
                  }
                />
              </div>

              <div className="absolute bottom-7 right-7">
                <label
                  htmlFor="resume-file-input"
                  className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
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
                  id="resume-file-input"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  className="hidden"
                />
              </div>
            </div>

            {abUrlList.length > 0 && (
              <div className="mt-2">
                <ul className="mt-1">
                  {abUrlList.map((doc, index) => (
                    <li
                      key={`ab-${doc.name}-${index}`}
                      className="flex justify-between items-center text-xs py-1 border-b border-gray-100"
                    >
                      <span className="truncate text-blue-500 flex-grow">
                        {doc.name}
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Visualiser"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(doc.name, "resume")
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mb-0">
            <h3 className="text-base font-bold mb-1 px-4">
              Ajouter un devoir collectif
            </h3>
            <p className="text-xs italic mb-3 px-4">
              Attribuez un travail au groupe pour&nbsp;
              <span className="font-bold">la séance prochaine</span>
            </p>
            <div className="bg-white rounded-2xl relative">
              <div className="flex justify-center w-full">
                <textarea
                  className="w-[95%] h-[14rem] border border-gray-300 bg-white rounded-2xl p-4 text-gray-800 placeholder-gray-400 mb-0"
                  value={devoirCollectif}
                  onChange={(e) => setDevoirCollectif(e.target.value)}
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
                  onChange={(e) => handleFileUpload(e, "devoir")}
                  className="hidden"
                />
              </div>
            </div>

            {hwUrlList.length > 0 && (
              <div className="mt-2">
                <ul className="mt-1">
                  {hwUrlList.map((doc, index) => (
                    <li
                      key={`hw-${doc.name}-${index}`}
                      className="flex justify-between items-center text-xs py-1 border-b border-gray-100"
                    >
                      <span className="truncate text-blue-500 flex-grow">
                        {doc.name}
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Visualiser"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDocument(doc.name, "devoir")
                          }
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {!isResumeOnlyMode && !isDevoirOnlyMode && (
        <div className="w-full mt-4 mb-2">
          {activeTab === "Résumé du cours" ? (
            <Button
              className="w-full py-3 text-black border border-black bg-white rounded-full font-bold"
              onClick={() => handleSwitchTab("Devoir collectif")}
              variant="black"
            >
              Ajouter un devoir collectif
            </Button>
          ) : (
            <Button
              className="w-full py-3 text-black border border-black bg-white rounded-full font-bold"
              onClick={() => handleSwitchTab("Résumé du cours")}
              variant="black"
            >
              Ajouter un résumé de cours
            </Button>
          )}
        </div>
      )}
      <div className="w-full mb-2">
        {sendingStatus.success && (
          <div className="bg-green-100 text-green-800 p-2 rounded-md mb-2 text-center">
            Envoi réussi !
          </div>
        )}
        {sendingStatus.error && (
          <div className="bg-red-100 text-red-800 p-2 rounded-md mb-2 text-center">
            {sendingStatus.error}
          </div>
        )}
        {(isResumeOnlyMode || activeTab === "Résumé du cours") &&
        !isDevoirOnlyMode ? (
          <Button
            className="w-full py-3 mt-4 text-shatibi-green bg-shatibi-green/[.15] rounded-full font-semibold"
            onClick={handleSendResume}
            variant="green"
            disabled={sendingStatus.loading}
          >
            {sendingStatus.loading
              ? "Envoi en cours..."
              : "Envoyer le cahier de séance"}
          </Button>
        ) : (
          <Button
            className="w-full py-3 mt-4 text-shatibi-green bg-shatibi-green/[.15] rounded-full font-semibold"
            onClick={handleSendBoth}
            variant="green"
            disabled={sendingStatus.loading}
          >
            {sendingStatus.loading
              ? "Envoi en cours..."
              : "Envoyer le cahier de séance"}
          </Button>
        )}
      </div>
      <Modal
        opened={isDocumentViewerOpen}
        onClose={closeDocumentViewer}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <DocumentViewer
          document={selectedDocument}
          isOpen={isDocumentViewerOpen}
          onClose={closeDocumentViewer}
        />
      </Modal>
      <Modal
        opened={showCdsConfirmationModal}
        onClose={closeCdsConfirmationModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <CdsConfirmation
          onConfirm={handleSendBothConfirmed}
          onCancel={closeCdsConfirmationModal}
        />
      </Modal>
      <Modal
        opened={showValidateWithoutHomeworkModal}
        onClose={closeValidateWithoutHomeworkModal}
        withCloseButton={false}
        radius="lg"
        centered
      >
        {Number.isInteger(groupId) &&
          groupId !== null &&
          teacherId !== null && (
            <ValidateWithoutHomework
              onValidate={handleSubmitWorkbook}
              onClickCancel={closeValidateWithoutHomeworkModal}
              groupId={groupId}
              teacherId={teacherId}
              date={dateToUse}
              studentId={studentId}
              abstract={activeTab === "Résumé du cours" ? resumeCours : ""}
              summaryFile={null}
            />
          )}
      </Modal>
    </div>
  );
};

export default ClassWork;
