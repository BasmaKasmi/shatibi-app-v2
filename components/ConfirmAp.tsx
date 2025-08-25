"use client";

import Button from "./Button";
import { displayDate } from "@/lib/dates";
import { useRouter } from "next/navigation";
import { declareStudentAP } from "@/api/index";
import { useState } from "react";
import { useTeacher } from "@/app/TeacherContext";

interface DeclareApProps {
  onClickCancel: () => void;
  onClickValidate: () => void;
  selectedDates: string[];
  student: {
    student_id: number;
    firstname: string;
    lastname: string;
  };
  groupId: number;
}

const ConfirmAp = ({
  onClickCancel,
  onClickValidate,
  selectedDates,
  groupId,
  student,
}: DeclareApProps) => {
  const router = useRouter();
  const { teacherId } = useTeacher();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectToDashboard = () => {
    router.push("/home");
  };

  const handleValidate = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const payload = {
        group_id: groupId,
        teacher_id: teacherId as number,
        student_id: student.student_id,
        date_list: selectedDates.map((date) => ({
          date: date,
          absence: "AP",
        })),
      };

      console.log("Payload envoyé à l'API:", payload);
      const response = await declareStudentAP(payload);

      if (response.status === "success") {
        console.log("Déclaration AP réussie :", response);
        redirectToDashboard();
        onClickValidate();
      } else {
        console.error("Erreur lors de la déclaration :", response.error);
        setErrorMessage(
          response.error?.fail ||
            "Une erreur est survenue lors de la déclaration."
        );
      }
    } catch (error) {
      console.error("Erreur API :", error);
      setErrorMessage("Une erreur inattendue s'est produite.");
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
        {selectedDates.map((date, index) => (
          <p key={index} className="text-[14px] font-normal">
            {displayDate(date)}
          </p>
        ))}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}

      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={onClickCancel}
          variant="red"
        >
          Annuler
        </Button>
        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Valider
        </Button>
      </div>
    </div>
  );
};

export default ConfirmAp;
