"use client";
import { evidenceDate } from "@/lib/dates";
import React from "react";

interface EvidenceData {
  studentName?: string;
  date?: string;
  hour?: string;
  evidence?: string;
}

interface EvidenceModalProps {
  data: EvidenceData | null;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ data }) => {
  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-md font-bold text-gray-900">
            {data?.studentName || "Nom prénom"}
          </h2>
          <p className="text-xs text-gray-600 whitespace-nowrap">
            Envoyé le {evidenceDate(data?.date)} à {data?.hour}
          </p>
        </div>
        <span className="bg-shatibi-orange/[.15] text-shatibi-orange px-4 py-2 rounded-full text-sm font-bold">
          Absence
        </span>
      </div>
      <div className="relative py-2 mt-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <h3 className="px-4 text-sm font-bold text-gray-500 bg-white">
            Motif d&apos;absence
          </h3>
        </div>
      </div>
      <div className="px-2">
        <p className="text-gray-800 text-center text-sm italic">
          {data?.evidence ? data.evidence : "Absence saisie par enseignant"}
        </p>
      </div>
    </div>
  );
};

export default EvidenceModal;
