"use client";

import EvaluationHeader from "@/components/EvaluationHeader";
import FloatingMenu from "@/components/FloatingMenu";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { cleanupTokens } from "@/lib/backend-api";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import StudentRouteGuard from "@/components/StudentRouteGuard";

export default function StudentEvaluation() {
  const [groupName, setGroupName] = useState<string | null>(null);
  const [groupSlot, setGroupSlot] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [selectedEvalId, setSelectedEvalId] = useState<any | null>(null);

  useEffect(() => {
    cleanupTokens();

    if (!localStorage.getItem("token")) {
      window.location.href = "/student-login";
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    setGroupName(url.searchParams.get("groupName"));
    setGroupSlot(url.searchParams.get("groupSlot"));
    setStudentId(Number(url.searchParams.get("studentId")));
    setGroupId(Number(url.searchParams.get("groupId")));
  }, []);

  useEffect(() => {
    if (studentId && groupId) {
      fetchStudentEvals();
    }
  }, [studentId, groupId]);

  const fetchStudentEvals = async () => {
    const response = await fetch(
      `/api/evaluation/notes/student?studentId=${studentId}&groupId=${groupId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    setEvaluations(res.data);
  };
  return (
    <StudentRouteGuard>
      <div className="md:hidden overflow-hidden">
        <div className="h-dvh flex flex-col gap-3 relative">
          <FloatingMenu />

          <div className="px-6 py-4">
            <EvaluationHeader title="Liste des évaluations" />

            {groupName && groupSlot && (
              <div className="mt-6">
                <h1 className="text-xl font-bold text-center">
                  {groupName.replace("An", "").replace("DIS", "").trim()}
                </h1>
                <p className="text-md font-semibold text-center">{groupSlot}</p>
              </div>
            )}

            <div className="flex flex-col mt-8 overflow-y-auto max-h-[80vh] cursor-pointer overflow-y-visible">
              {evaluations?.length > 0 ? (
                evaluations.map((evaluation) => {
                  return (
                    <div
                      key={evaluation._id}
                      className="bg-white shadow-md rounded-xl w-[100%] mt-2 mb-1"
                      onClick={() =>
                        selectedEvalId != evaluation._id
                          ? setSelectedEvalId(evaluation._id)
                          : setSelectedEvalId(null)
                      }
                    >
                      <div className="mb-3 mx-auto flex justify-between items-center px-6">
                        <div className="mr-4">
                          <p className="text-[14px] font-semibold">
                            {evaluation.evalSheetId.modId.title +
                              " " +
                              evaluation.evalSheetId.subject}
                          </p>
                          <p className="text-xs font-light">
                            fait le{" "}
                            {dayjs(evaluation.evalSheetId.passageDate).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                        <span
                          className="text-xs font-medium py-1 rounded-full"
                          style={{
                            // Définir la couleur en fonction du score
                            color: isNaN(evaluation.score)
                              ? "#B7B6B6" // Couleur par défaut si score non numérique
                              : evaluation.score >=
                                evaluation.evalSheetId.scaleId?.max / 2
                              ? "#19CE15" // Couleur verte pour score élevé
                              : "#FF2525", // Couleur rouge pour score bas
                            // Définir l'arrière-plan en fonction du score
                            background: isNaN(evaluation.score)
                              ? "#E5E4E3B2" // Couleur de fond par défaut si score non numérique
                              : evaluation.score >=
                                evaluation.evalSheetId.scaleId?.max / 2
                              ? "#19CE1526" // Couleur verte transparente
                              : "#FF252526", // Couleur rouge transparente
                            marginLeft: "auto",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                            minWidth: "30%",
                            textAlign: "center",
                          }}
                        >
                          {isNaN(evaluation.score)
                            ? `${evaluation.nc ? "N.C" : evaluation.score}`
                            : `${evaluation.score}/${evaluation.evalSheetId.scaleId?.max}`}
                        </span>
                      </div>

                      {selectedEvalId == evaluation._id && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "#E5E4E3",
                            }}
                          >
                            <div className="line"></div>
                            <span
                              className="text-[14px] font-semibold"
                              style={{ color: "#484C52" }}
                            >
                              Appréciation
                            </span>
                            <div className="line"></div>
                          </div>
                          <p className="text-center italic text-[12px] mt-2 mb-4 font-normal">
                            {evaluation.appreciation ||
                              (evaluation.nc
                                ? "Non concerné(e) par cette évaluation"
                                : "Pas d'appréciation pour cette évaluation")}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center mt-5">Aucune évaluation</p>
              )}
            </div>
          </div>
          <BottomMenuStudent />
        </div>
      </div>
    </StudentRouteGuard>
  );
}
