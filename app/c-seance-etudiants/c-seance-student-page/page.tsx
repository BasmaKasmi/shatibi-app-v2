"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { displayDate, formatDayToThreeLetters } from "@/lib/dates";
import { decodeHtml, formatCourseName } from "@/lib/format-utils";
import EvaluationHeader from "@/components/EvaluationHeader";
import { FaEye } from "react-icons/fa";
import { Modal } from "@mantine/core";
import DocumentViewer from "@/components/DocumentViewer";

interface Document {
  name: string;
  url: string;
}

interface ViewableDocument {
  name: string;
  url: string;
  mime?: string;
}

const CSeanceStudentPage = () => {
  const search = useSearchParams();
  const rawAbstract = search.get("abstract") ?? "";
  const rawHomework = search.get("homework") ?? "";
  const abstract = decodeHtml(rawAbstract);
  const homework = decodeHtml(rawHomework);
  const abUrlList: Document[] = JSON.parse(search.get("abUrlList") ?? "[]");
  const hwUrlList: Document[] = JSON.parse(search.get("hwUrlList") ?? "[]");
  const [selectedDocument, setSelectedDocument] =
    useState<ViewableDocument | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);
  const groupName = search.get("groupName");
  const groupSlot = search.get("groupSlot");
  const date = search.get("date") ?? "";

  const handleViewDocument = (doc: Document): void => {
    setSelectedDocument({
      name: doc.name,
      url: doc.url,
      mime: (doc as any).mime,
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
    return (
      <div className="text-sm" dangerouslySetInnerHTML={{ __html: content }} />
    );
  };

  return (
    <div className="h-dvh flex flex-col gap-2 relative md:hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Cahier de séance" />
      </div>
      <div className="text-center">
        {groupName && groupSlot && (
          <div className="-mt-3">
            <h1 className="text-xl font-bold">{formatCourseName(groupName)}</h1>
            <div className="flex justify-center items-center gap-1">
              <p className="text-md font-semibold">
                {formatDayToThreeLetters(groupSlot)}
              </p>
              <p className="text-md font-semibold">-</p>
              {date && (
                <p className="text-md font-semibold">{displayDate(date)}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {abstract && (
          <div className="max-w-xs sm:max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md mb-2 w-auto h-auto min-h-[30vh]">
            <h2 className="text-md font-semibold text-gray-600 text-center mb-2">
              Résumé du cours :
            </h2>
            <div className="rounded-lg">
              {renderContent(abstract, "Résumé")}
            </div>
            {abUrlList.length > 0 && (
              <div className="mt-4">
                <ul>
                  {abUrlList.map((doc: Document, index: number) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <a
                        href={doc.url}
                        download={doc.name}
                        className="text-blue-600 hover:underline truncate flex-grow"
                      >
                        {doc.name}
                      </a>
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
        )}

        {homework && (
          <div className="max-w-xs sm:max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-md mb-2 w-auto h-auto min-h-[30vh]">
            <h2 className="text-md font-semibold text-gray-600 text-center mb-2">
              Travail à faire :
            </h2>
            <div>{renderContent(homework, "Travail")}</div>
            {hwUrlList.length > 0 && (
              <div className="mt-4">
                <ul>
                  {hwUrlList.map((doc: Document, index: number) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <a
                        href={doc.url}
                        download={doc.name}
                        className="text-blue-600 hover:underline truncate flex-grow"
                      >
                        {doc.name}
                      </a>
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
        )}
      </div>
      {/*<div className="w-full bg-white py-6">
        <Button className="mx-auto block font-bold" variant="green">
          Déclarer comme fait
        </Button>
      </div>*/}
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

export default CSeanceStudentPage;
