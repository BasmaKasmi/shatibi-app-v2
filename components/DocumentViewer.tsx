"use client";
import React from "react";
import { Modal } from "@mantine/core";
import { FaTimes } from "react-icons/fa";

interface DocumentType {
  name: string;
  url: string;
  mime?: string;
}

interface DocumentViewerProps {
  document: DocumentType | null;
  isOpen: boolean;
  onClose: () => void;
}

const isImageFile = (fileName: string, mimeType?: string): boolean => {
  if (mimeType && mimeType.startsWith("image/")) return true;
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

const isPdfFile = (fileName: string, mimeType?: string): boolean => {
  if (mimeType === "application/pdf") return true;
  return fileName.toLowerCase().endsWith(".pdf");
};

const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  if (!document) return null;

  const isPdf = isPdfFile(document.name, document.mime);
  const isImage = isImageFile(document.name, document.mime);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      size="lg"
      radius="lg"
      centered
    >
      <div className="relative h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md"
        >
          <FaTimes className="text-gray-700" />
        </button>
        <div className="h-[80vh] w-full overflow-hidden">
          {isImage ? (
            <img
              src={document.url}
              alt={document.name}
              className="w-full h-full object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={`${document.url}#toolbar=0`}
              title={document.name}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
              <p className="text-center mb-4">
                Ce type de document ne peut pas être affiché directement.
              </p>
              <a
                href={document.url}
                download={document.name}
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Télécharger le fichier
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewer;
