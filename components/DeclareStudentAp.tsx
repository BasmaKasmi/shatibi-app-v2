"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { displayDate } from "@/lib/dates";
import { useStudent } from "@/app/StudentContext";
import { declareStudentAbsence } from "@/lib/student-api";

interface CancelledAbsenceMotif {
  date: string;
  evidence: string;
}

interface ActiveAbsence {
  date: string;
  absent: string;
  evidence?: string;
}

interface DeclareStudentApProps {
  onClickCancel: () => void;
  onClickValidate: () => void;
  selectedDates: string[];
  groupId: number;
  evidence: string;
  setEvidence: (value: string) => void;
  activeAbsences: ActiveAbsence[];
  cancelledAbsenceMotifs?: CancelledAbsenceMotif[];
}

const filterAndValidateDates = (dates: string[]): string[] => {
  if (!Array.isArray(dates)) {
    console.error("Les dates ne sont pas un tableau:", dates);
    return [];
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);

  console.log("=== FILTRAGE DES DATES ===");
  console.log("Date limite (hier):", yesterday.toISOString().split("T")[0]);
  console.log("Dates reçues:", dates);

  const filtered = dates
    .map((date) => {
      if (!date || typeof date !== "string") {
        console.warn("Date invalide ignorée:", date);
        return null;
      }

      let formattedDate = date;

      if (date.includes("/")) {
        const parts = date.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
          console.log(`Conversion: ${date} -> ${formattedDate}`);
        } else {
          console.warn("Format DD/MM/YYYY invalide:", date);
          return null;
        }
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formattedDate)) {
        console.warn("Format final invalide:", formattedDate);
        return null;
      }

      const dateObj = new Date(formattedDate + "T00:00:00");
      const isValid = dateObj > yesterday;

      console.log(
        ` ${formattedDate} > ${yesterday.toISOString().split("T")[0]} ?`,
        isValid
      );

      if (!isValid) {
        console.log(`Date ${formattedDate} rejetée car trop ancienne`);
      } else {
        console.log(`Date ${formattedDate} acceptée`);
      }

      return isValid ? formattedDate : null;
    })
    .filter((date): date is string => date !== null);

  console.log("Dates finales après filtrage:", filtered);
  return filtered;
};

const DeclareStudentAp = ({
  onClickCancel,
  selectedDates,
  onClickValidate,
  groupId,
  evidence,
  setEvidence,
  activeAbsences,
  cancelledAbsenceMotifs = [],
}: DeclareStudentApProps) => {
  const { studentId, token } = useStudent();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("DeclareStudentAp - Initialisation avec:");
    console.log("- selectedDates:", selectedDates);
    console.log("- evidence actuelle:", evidence);
    console.log("- cancelledAbsenceMotifs:", cancelledAbsenceMotifs);

    if (
      !evidence &&
      cancelledAbsenceMotifs.length > 0 &&
      cancelledAbsenceMotifs[0]?.evidence
    ) {
      console.log(
        "Définition de l'evidence depuis les motifs annulés:",
        cancelledAbsenceMotifs[0].evidence
      );
      setEvidence(cancelledAbsenceMotifs[0].evidence);
    }
  }, [cancelledAbsenceMotifs, evidence, setEvidence, selectedDates]);

  const handleValidate = async () => {
    console.log("=== DÉBUT DE LA VALIDATION ===");
    console.log("Debug initial:");
    console.log("- Evidence:", evidence);
    console.log("- SelectedDates:", selectedDates);
    console.log("- StudentId:", studentId, typeof studentId);
    console.log("- Token présent?", !!token);
    console.log("- GroupId:", groupId, typeof groupId);

    if (!evidence || evidence.trim() === "") {
      setErrorMessage("Le motif d'absence est obligatoire");
      return;
    }

    if (!studentId || !token) {
      setErrorMessage("Identifiants manquants");
      return;
    }

    if (!groupId) {
      setErrorMessage("ID de groupe manquant");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (!selectedDates || selectedDates.length === 0) {
        if (cancelledAbsenceMotifs.length > 0) {
          console.log(
            " Seulement des absences annulées - passage à la confirmation"
          );
          onClickValidate();
          return;
        } else {
          setErrorMessage("Aucune date sélectionnée pour l'absence");
          return;
        }
      }

      console.log("TRAITEMENT DES DATES");
      console.log("Dates brutes reçues:", selectedDates);

      const validDates = filterAndValidateDates(selectedDates);
      console.log("Dates valides après traitement:", validDates);

      if (validDates.length === 0) {
        setErrorMessage(
          "Aucune date valide sélectionnée (vérifiez le format et que les dates sont dans le futur)"
        );
        return;
      }
      const payload = {
        token,
        group_id: Number(groupId),
        student_id: Number(studentId),
        date_list: validDates.map((date) => ({
          date: date,
          absence: "AP",
          evidence: evidence.trim(),
        })),
      };

      console.log("PAYLOAD FINAL (identique à Postman):");
      console.log(JSON.stringify(payload, null, 2));

      console.log("Envoi vers l'API...");
      const response = await declareStudentAbsence(payload);

      console.log("RÉPONSE API:");
      console.log(JSON.stringify(response, null, 2));

      if (response.status === "success") {
        console.log("Déclaration réussie !");
        onClickValidate();
      } else {
        console.log("Erreur API:", response.error);

        const errorMsg =
          response.error?.no_request ||
          response.error?.no_student ||
          response.error?.token_not_match ||
          response.error?.token_expire ||
          response.error?.no_date ||
          "Erreur lors de la déclaration";

        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Exception attrapée:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        console.error("Status HTTP:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);
      }

      setErrorMessage(error instanceof Error ? error.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-2 grid justify-items-center">
      <h3 className="text-center text-lg font-semibold text-black my-2">
        Absences prévues le :
      </h3>
      <div className="text-center space-y-2">
        {selectedDates && selectedDates.length > 0 ? (
          selectedDates.map((date, index) => (
            <p key={`selected-${index}`} className="text-[14px] font-normal">
              {displayDate(date)}
            </p>
          ))
        ) : (
          <p className="text-center text-[14px] text-gray-500">
            {cancelledAbsenceMotifs.length > 0
              ? "Modification d'absence existante"
              : "Aucune nouvelle absence sélectionnée"}
          </p>
        )}
      </div>

      {cancelledAbsenceMotifs.length > 0 && (
        <div className="mt-2 text-center">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">
            Absences annulées :
          </h4>
          {cancelledAbsenceMotifs.map((motif, index) => (
            <p key={`cancelled-${index}`} className="text-[12px] text-red-600">
              {displayDate(motif.date)}
            </p>
          ))}
        </div>
      )}

      <div className="mt-4 w-full">
        <label htmlFor="evidence" className="text-sm text-gray-600 mb-2 block">
          Motif de l&apos;absence :
        </label>
        <textarea
          id="evidence"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="Saisissez le motif de votre absence..."
        />
      </div>

      {errorMessage && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 rounded-md">
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={onClickCancel}
          variant="red"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Valider"}
        </Button>
      </div>
    </div>
  );
};

export default DeclareStudentAp;
