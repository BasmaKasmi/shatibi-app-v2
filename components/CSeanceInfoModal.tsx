"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Modal } from "@mantine/core";
import DocumentViewer from "@/components/DocumentViewer";
import {
  cleanHtmlParagraphs,
  decodeHtmlEntities,
  formatText,
} from "@/lib/format-utils";
import { WorkbookSessionDocument, fetchWorkbookSessionInfo } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";

interface ViewableDocument {
  name: string;
  url: string;
  mime?: string;
}

interface CSeanceInfoModalProps {
  workbookId: number;
  date: string;
  groupId: number;
  teacherId: number;
  groupName?: string;
  isOpen: boolean;
  onClose: () => void;
  viewType?: "Résumé du cours" | "Devoir collectif";
  modalTitle?: string;
}

const CSeanceInfoModal = ({
  date,
  groupId,
  teacherId,
  groupName,
  isOpen,
  onClose,
  viewType = "Résumé du cours",
  modalTitle,
}: CSeanceInfoModalProps) => {
  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);

  const {
    data: workbookSessionInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.WORKBOOK_SESSION_INFO, teacherId, groupId, date],
    queryFn: () => fetchWorkbookSessionInfo(teacherId, groupId, date),
    enabled: !!teacherId && !!groupId && !!date && isOpen,
    retry: false,
  });

  const sessionData = workbookSessionInfo?.result;
  const sessionInfo = Array.isArray(sessionData) ? sessionData[0] : sessionData;

  const abstract = sessionInfo?.abstract || "";
  const homework = sessionInfo?.homework || "";
  const abUrlList = sessionInfo?.abUrlList || [];
  const hwUrlList = sessionInfo?.hwUrlList || [];

  const getModalTitle = () => {
    if (modalTitle) {
      return modalTitle;
    }
    return viewType === "Devoir collectif"
      ? "Devoir collectif"
      : "Résumé du cours";
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

  const handleViewDocument = (doc: WorkbookSessionDocument): void => {
    setSelectedDocument({
      name: doc.name,
      url: doc.url,
      mime: doc.mime,
    });
    setIsDocumentViewerOpen(true);
  };

  const closeDocumentViewer = (): void => {
    setIsDocumentViewerOpen(false);
    setSelectedDocument(null);
  };

  const renderContent = (content: string, type: "Résumé" | "Travail") => {
    if (content === "no_workbook") {
      return (
        <p className="text-gray-500">{type} : Aucun cahier de séance trouvé.</p>
      );
    }
    if (content === "NA") {
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
          {groupName ? `${groupName}` : ""}
        </p>
        <p className="text-center text-sm font-semibold mb-1">
          Séance du {new Date(date).toLocaleDateString("fr-FR")}
        </p>

        <div className="p-3 w-full max-w-md h-64">
          {viewType === "Résumé du cours" ? (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-base font-bold mb-1">Résumé du cours</h3>
              <div className="border border-gray-300 bg-white rounded-2xl p-4 w-full flex-1 shadow-sm flex flex-col">
                <div className="bg-white rounded-lg flex-grow">
                  {renderContent(abstract, "Résumé")}
                </div>
                {abUrlList.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <ul className="max-h-32 overflow-y-auto">
                      {abUrlList.map((doc, index) => (
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
          ) : (
            <div className="w-full h-full flex flex-col">
              <h3 className="text-base font-bold mb-1">Devoir collectif</h3>
              <div className="border border-gray-300 bg-white rounded-2xl p-4 w-full flex-1 shadow-sm flex flex-col">
                <div className="bg-white rounded-lg flex-grow">
                  {renderContent(homework, "Travail")}
                </div>
                {hwUrlList.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <ul className="max-h-32 overflow-y-auto">
                      {hwUrlList.map((doc, index) => (
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

export default CSeanceInfoModal;
