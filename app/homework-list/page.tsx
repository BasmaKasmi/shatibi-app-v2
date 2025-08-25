"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import { formatDateFrench } from "@/lib/dates";
import {
  getStudentWorkbookContent,
  validateStudentWorkbookContent,
  getStudentContentList,
  StudentContentItem,
  addStudentDocument,
  deleteStudentDocument,
} from "@/lib/student-api";
import DocumentViewer from "@/components/DocumentViewer";
import { QUERY_KEY } from "@/lib/queries";
import EvaluationHeader from "@/components/EvaluationHeader";
import Button from "@/components/Button";
import Image from "next/image";
import validation from "@/public/validation-icon.svg";
import { Modal } from "@mantine/core";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import PaperClip from "@/public/assets/Paperclip.svg";

export interface WorkbookContentFile {
  name: string;
  coUrl: string;
}

interface DocumentType {
  name: string;
  url: string;
  mime?: string;
}

interface HomeworkDetail {
  homework: string;
  date: string;
  hasAttachments: boolean;
  attachments: WorkbookContentFile[];
  liaisonId: number;
  validated: boolean;
  groupName?: string;
}

const HomeworkList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupId = searchParams.get("groupId");
  const groupName = searchParams.get("groupName");
  const groupSlot = searchParams.get("groupSlot");
  const urlStudentId = searchParams.get("studentId");
  const urlToken = searchParams.get("token");

  const [studentId, setStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [homeworkDetails, setHomeworkDetails] = useState<{
    [liaisonId: number]: HomeworkDetail;
  }>({});
  const [selectedHomework, setSelectedHomework] = useState<{
    workbookId: number;
    liaisonId: number;
    date: string;
  } | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [localContentList, setLocalContentList] = useState<
    StudentContentItem[]
  >([]);
  const [isUploadingDocument, setIsUploadingDocument] =
    useState<boolean>(false);
  const [currentUploadLiaisonId, setCurrentUploadLiaisonId] = useState<
    number | null
  >(null);
  const [isDeletingDocument, setIsDeletingDocument] = useState<boolean>(false);
  const [currentDeleteFileName, setCurrentDeleteFileName] = useState<
    string | null
  >(null);

  const isValidHomework = (homework: string | undefined | null): boolean => {
    if (!homework) return false;

    const trimmedHomework = homework.trim();

    const invalidValues = ["NA", "na", "N/A", "n/a", "no_liaison", ""];

    return !invalidValues.includes(trimmedHomework);
  };

  const openDocumentViewer = (document: DocumentType) => {
    setSelectedDocument(document);
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = (): void => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddDocument = async (liaisonId: number) => {
    if (!studentId || !token) {
      return;
    }

    setCurrentUploadLiaisonId(liaisonId);

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteDocument = async (liaisonId: number, fileName: string) => {
    if (!studentId || !token) {
      return;
    }

    setIsDeletingDocument(true);
    setCurrentDeleteFileName(fileName);

    try {
      const payload = {
        student_id: studentId,
        token: token,
        liaison_id: liaisonId,
        file_name: fileName,
      };

      const response = await deleteStudentDocument(payload);

      if (response.status === "success") {
        setLocalContentList((prev) =>
          prev.map((item) =>
            item.liaison_id === liaisonId
              ? {
                  ...item,
                  docList:
                    item.docList?.filter((doc) => doc.name !== fileName) || [],
                }
              : item
          )
        );
      } else {
        console.error("Erreur suppression:", response.error);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
    } finally {
      setIsDeletingDocument(false);
      setCurrentDeleteFileName(null);
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentUploadLiaisonId || !studentId || !token) {
      return;
    }

    setIsUploadingDocument(true);

    try {
      const fileContent = await fileToBase64(file);

      const payload = {
        student_id: studentId,
        token: token,
        liaison_id: currentUploadLiaisonId,
        file_name: file.name,
        file_mime: file.type,
        file_content: fileContent,
      };

      const response = await addStudentDocument(payload);

      if (response.status === "success") {
        const response2 = await getStudentContentList({
          student_id: studentId,
          token: token,
          group_id: Number(groupId),
        });

        if (response2.result) {
          setLocalContentList(response2.result);
        }
      } else {
        console.error("Erreur ajout:", response.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
    } finally {
      setIsUploadingDocument(false);
      setCurrentUploadLiaisonId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    const storedStudentId = localStorage.getItem("student_id");
    const storedToken = localStorage.getItem("token");

    if (storedStudentId && storedToken) {
      setStudentId(Number(storedStudentId));
      setToken(storedToken);
    } else if (urlStudentId && urlToken) {
      setStudentId(Number(urlStudentId));
      setToken(urlToken);
    } else {
      router.push("/student-login");
    }
  }, [router, urlStudentId, urlToken]);

  const {
    data: contentListData,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_CONTENT_LIST, studentId, groupId],
    queryFn: async () => {
      if (!studentId || !token || !groupId) {
        throw new Error("Student ID, token et group ID sont requis");
      }

      const response = await getStudentContentList({
        student_id: studentId,
        token: token,
        group_id: Number(groupId),
      });

      return response;
    },
    enabled: !!studentId && !!token && !!groupId,
  });

  const fetchHomeworkDetail = async (liaisonId: number, date: string) => {
    if (!studentId || !token || !groupId) return;

    try {
      const response = await getStudentWorkbookContent({
        group_id: Number(groupId),
        student_id: studentId,
        date: date,
        token: token,
      });

      if (response.result) {
        const homework = response.result.homework;

        if (isValidHomework(homework)) {
          setHomeworkDetails((prev) => ({
            ...prev,
            [liaisonId]: {
              homework: homework || "",
              date: response.result!.date || date,
              hasAttachments: !!(
                response.result!.coUrlList &&
                response.result!.coUrlList.length > 0
              ),
              attachments: response.result!.coUrlList || [],
              liaisonId: response.result!.liaison_id || 0,
              validated: response.result!.validated || false,
              groupName: groupName || "",
            },
          }));
        }
      }
    } catch (error) {
      console.error(
        `Error fetching homework detail for liaison ${liaisonId}:`,
        error
      );
    }
  };

  const handleValidateHomework = async (liaisonId: number) => {
    if (!studentId || !token) {
      console.error("Student ID et token sont requis");
      return;
    }

    setSelectedHomework(null);

    setLocalContentList((prev) =>
      prev.map((item) =>
        item.liaison_id === liaisonId ? { ...item, validated: "1" } : item
      )
    );

    try {
      const response = await validateStudentWorkbookContent({
        liaison_id: liaisonId,
        student_id: studentId,
        token: token,
      });

      if (response.status === "success") {
        setHomeworkDetails((prev) => ({
          ...prev,
          [liaisonId]: {
            ...prev[liaisonId],
            validated: true,
          },
        }));
      } else {
        setLocalContentList((prev) =>
          prev.map((item) =>
            item.liaison_id === liaisonId ? { ...item, validated: "0" } : item
          )
        );
      }
    } catch (error) {
      setLocalContentList((prev) =>
        prev.map((item) =>
          item.liaison_id === liaisonId ? { ...item, validated: "0" } : item
        )
      );
      console.error("Erreur lors de la validation du travail:", error);
    }
  };

  const handleHomeworkClick = async (item: StudentContentItem) => {
    const isSelected = selectedHomework?.liaisonId === item.liaison_id;

    if (isSelected) {
      setSelectedHomework(null);
    } else {
      setSelectedHomework({
        workbookId: item.workbook_id,
        liaisonId: item.liaison_id,
        date: item.date,
      });

      if (!homeworkDetails[item.liaison_id]) {
        await fetchHomeworkDetail(item.liaison_id, item.date);
      }
    }
  };

  useEffect(() => {
    if (contentListData?.result) {
      setLocalContentList(contentListData.result);
    }
  }, [contentListData]);

  if (!studentId) {
    return <div>Invalid Student ID</div>;
  }

  if (isContentLoading) return <div>Chargement...</div>;
  if (isContentError) return <div>Erreur: {contentError.message}</div>;

  const contentList =
    localContentList.length > 0
      ? localContentList
      : contentListData?.result || [];

  const filteredContentList = contentList.filter((item) => {
    const homeworkDetail = homeworkDetails[item.liaison_id];

    if (homeworkDetail) {
      return isValidHomework(homeworkDetail.homework);
    }
    return true;
  });

  const sortedContentList = contentList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />

      <div className="px-5 py-4">
        <EvaluationHeader title="Liste devoirs à faire" />
      </div>

      <div className="flex flex-col mt-2 overflow-y-auto max-h-[80vh] pb-4">
        {sortedContentList.length > 0 ? (
          sortedContentList.map((item) => {
            const isSelected = selectedHomework?.liaisonId === item.liaison_id;
            const homeworkDetail = homeworkDetails[item.liaison_id];
            const isValidated = item.validated === "1";

            if (homeworkDetail && !isValidHomework(homeworkDetail.homework)) {
              return null;
            }
            return (
              <div
                key={item.liaison_id}
                className={`px-6 ${
                  isSelected ? "py-6" : "py-3"
                } px-6 py-2 bg-white shadow-md rounded-2xl w-[90%] mb-3 mx-auto relative cursor-pointer`}
                onClick={() => handleHomeworkClick(item)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[14px] font-semibold">
                      {groupName || ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      Envoyé le{" "}
                      {formatDateFrench(homeworkDetail?.date || item.date)}
                    </p>
                  </div>

                  {isValidated && (
                    <div className="absolute right-3 top-3">
                      <Image
                        src={validation}
                        alt="Travail validé"
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                </div>

                {isSelected && homeworkDetail && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center w-full relative">
                      <div className="h-[1px] bg-gray-200 flex-1" />
                      <h2 className="text-sm text-gray-700 font-bold px-4">
                        Travail à faire
                      </h2>
                      <div className="h-[1px] bg-gray-200 flex-1" />
                    </div>

                    <div>
                      {!isValidHomework(homeworkDetail.homework) ? (
                        <p className="text-gray-800 text-center text-sm italic">
                          Pas de devoir pour ce cours
                        </p>
                      ) : (
                        <p className="text-gray-800 text-center text-sm italic">
                          {homeworkDetail.homework || "Aucun devoir spécifié"}
                        </p>
                      )}
                      {item.docList && item.docList.length > 0 && (
                        <div className="mt-3">
                          <ul className="mt-2 space-y-1">
                            {item.docList.map((attachment, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center py-2 px-3"
                              >
                                <span className="text-blue-600 text-xs truncate flex-grow">
                                  {attachment.name}
                                </span>
                                <div className="flex items-center gap-2 ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDocumentViewer({
                                        name: attachment.name || "Document",
                                        url: attachment.stUrl,
                                      });
                                    }}
                                    className="text-blue-500 hover:text-blue-700 p-1"
                                    title="Visualiser"
                                  >
                                    <FaEye size={14} />
                                  </button>
                                  {!isValidated && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDocument(
                                          item.liaison_id,
                                          attachment.name
                                        );
                                      }}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      title="Supprimer"
                                      disabled={
                                        isDeletingDocument &&
                                        currentDeleteFileName ===
                                          attachment.name
                                      }
                                    >
                                      {isDeletingDocument &&
                                      currentDeleteFileName ===
                                        attachment.name ? (
                                        <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <FaTrashAlt size={14} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!isValidated &&
                        isValidHomework(homeworkDetail.homework) && (
                          <div className="mt-4 flex justify-center items-center gap-3">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleValidateHomework(item.liaison_id);
                              }}
                              className="font-bold py-2"
                              variant="green"
                            >
                              Déclarer comme fait
                            </Button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddDocument(item.liaison_id);
                              }}
                              className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                              title="Ajouter un document"
                              disabled={
                                isUploadingDocument &&
                                currentUploadLiaisonId === item.liaison_id
                              }
                            >
                              {isUploadingDocument &&
                              currentUploadLiaisonId === item.liaison_id ? (
                                <div className="w-6 h-6 rounded-full animate-spin"></div>
                              ) : (
                                <Image
                                  src={PaperClip}
                                  alt="Ajouter un document"
                                  width={24}
                                  height={24}
                                />
                              )}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-500">Aucun devoir trouvé pour ce groupe</p>
          </div>
        )}
      </div>

      <BottomMenuStudent />

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
    </div>
  );
};

export default HomeworkList;
