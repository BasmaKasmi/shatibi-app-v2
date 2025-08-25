"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Modal } from "@mantine/core";
import DocumentViewer from "@/components/DocumentViewer";
import {
  cleanHtmlParagraphs,
  decodeHtmlEntities,
  formatText,
  extrairePrenom,
} from "@/lib/format-utils";
import { getWorkbookContentInfo } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface ViewableDocument {
  name: string;
  url: string;
  mime?: string;
}

interface CorrespondenceViewModalProps {
  studentName: string;
  studentId: number;
  groupId: number;
  teacherId: number;
  date: string;
  groupName?: string;
  isOpen: boolean;
  onClose: () => void;
  viewType?: "Carnet de liaison" | "Devoir individuel";
  modalTitle?: string;
  onContentUpdated?: () => void;
}

const CorrespondenceViewModal = ({
  studentName,
  studentId,
  groupId,
  teacherId,
  date,
  groupName,
  isOpen,
  onClose,
  viewType = "Carnet de liaison",
  modalTitle,
}: CorrespondenceViewModalProps) => {
  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);

  const {
    data: correspondenceInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["correspondence_content", teacherId, groupId, studentId, date],
    queryFn: () =>
      getWorkbookContentInfo({
        group_id: groupId,
        teacher_id: teacherId,
        student_id: studentId,
        date: date,
      }),
    enabled: !!teacherId && !!groupId && !!studentId && !!date && isOpen,
    retry: false,
  });

  const correspondenceData = correspondenceInfo?.result;

  const liaison = correspondenceData?.liaison || "";
  const homework = correspondenceData?.homework || "";
  const coUrlList = correspondenceData?.coUrlList || [];

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

  if (isLoading) {
    return (
      <Modal
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        radius="lg"
        centered
        size="md"
      >
        <div className="flex justify-center items-center h-32">
          <p className="text-center">Chargement des données...</p>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        opened={isOpen}
        onClose={onClose}
        withCloseButton={false}
        radius="lg"
        centered
        size="md"
      >
        <div className="flex justify-center items-center h-32">
          <p className="text-center text-red-500">
            Erreur lors du chargement des données
          </p>
        </div>
      </Modal>
    );
  }

  const handleViewDocument = (doc: any): void => {
    setSelectedDocument({
      name: doc.name,
      url: doc.coUrl,
      mime: doc.mime || determineFileType(doc.name),
    });
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = (): void => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

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

  const renderContent = (content: string, type: "Liaison" | "Devoir") => {
    if (content === "no_liaison" || content === "no_workbook") {
      return (
        <p className="text-center text-gray-500 text-sm">
          {type} : Aucune correspondance trouvée.
        </p>
      );
    }
    if (content === "NA" || !content || content.trim() === "") {
      return (
        <p className="text-gray-500 text-center text-sm">
          Aucun {type.toLowerCase()} disponible
        </p>
      );
    }

    const decodedContent = decodeHtmlEntities(content);
    const cleanedContent = cleanHtmlParagraphs(decodedContent);
    const formattedContent = formatText(cleanedContent);

    return (
      <div
        className="text-sm whitespace-pre-line overflow-y-auto max-h-32"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      radius="lg"
      centered
      size="md"
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto py-1 overflow-hidden">
        <p className="text-center text-sm font-semibold mb-1">
          {groupName && `${groupName}`}
          <br />
          Séance du {formatDate(correspondenceData?.date || date)}
        </p>

        <div className="p-3 w-full max-w-md h-64">
          {viewType === "Carnet de liaison" ? (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-base font-bold mb-1">
                Carnet de liaison de {extrairePrenom(studentName)} :
              </h3>
              <div className="border border-gray-300 bg-white rounded-2xl p-4 w-full flex-1 shadow-sm flex flex-col">
                <div className="bg-white rounded-lg flex-grow">
                  {renderContent(liaison, "Liaison")}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-base font-bold mb-1">
                Devoir individuel de {extrairePrenom(studentName)} :
              </h3>
              <div className="border border-gray-300 bg-white rounded-2xl p-4 w-full flex-1 shadow-sm flex flex-col">
                <div className="bg-white rounded-lg flex-grow">
                  {renderContent(homework, "Devoir")}
                </div>
                {coUrlList.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <ul className="max-h-32 overflow-y-auto">
                      {coUrlList.map((doc: any, index: number) => (
                        <li
                          key={index}
                          className="flex justify-between items-center text-xs py-1"
                        >
                          <span className="truncate text-blue-500 flex-grow">
                            {doc.name}
                          </span>
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="text-blue-500 hover:text-blue-700 ml-2"
                            title="Visualiser"
                          >
                            <FaEye size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
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
      </div>
    </Modal>
  );
};

export default CorrespondenceViewModal;
