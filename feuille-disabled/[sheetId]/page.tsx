"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "react-toastify";
import { useTeacher } from "@/app/TeacherContext";
import Button from "@/components/Button";
import { Rating, Scale } from "@/api";
import HeaderWithRecapButton from "@/components/HeaderWithRecapButton";
import useGroup from "@/hooks/useGroup";
import { formatTitle } from "@/lib/dates";
import EvalAppreciationModal from "@/components/EvalAppreciationModal";
import SendEvalDateModal from "@/components/SendEvalDateModal";

const FeuillePage = () => {
  const { teacherId } = useTeacher();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = Number(searchParams.get("groupId"));
  const [evalRating, setEvalRating] = useState([] as Rating[]);
  const [scale, setScale] = useState({} as Scale);
  const [modalToDisplay, setModalToDisplay] = useState("");
  const [appreciation, setAppreciation] = useState("");
  const [selectedRateId, setSelectedRateId] = useState({} as Rating);
  const [date, setDate] = useState(new Date());
  const params = useParams();

  const { allStudents, groupsStatistics, getStudentStatistics } = useGroup({
    date: "",
    groupId,
  });

  const onClickCancel = () => {
    setModalToDisplay("");
  };
  const groupTitle = searchParams.get("groupTitle");
  const sheetTitle = searchParams.get("sheetTitle");

  const addAppreciation = () => {
    const updatedAppreciation = evalRating.map((rate: Rating) =>
      rate._id.toString() === selectedRateId._id.toString()
        ? { ...rate, appreciation: appreciation }
        : rate
    );
    setEvalRating(updatedAppreciation);
    setModalToDisplay("");
    setSelectedRateId({} as Rating);
  };

  useEffect(() => {
    const scaleCookie = Cookies.get("scale");
    if (scaleCookie) {
      try {
        const parsedScale: Scale = JSON.parse(scaleCookie);
        setScale(parsedScale);
      } catch (error) {
        console.error("Erreur lors du parsing du cookie:", error);
      }
    }

    if (params.sheetId) {
      let date = groupTitle?.split("le").pop()?.trim() || "";
      const dateArr = date.split("/");
      date = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];

      const getRating = async () => {
        const response = await fetch(
          "/api/evaluation/notes?sheetId=" +
            params.sheetId +
            "&groupId=" +
            groupId +
            "&teacherId=" +
            teacherId +
            "&date=" +
            date,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();
        setEvalRating(res.data);
      };
      getRating();
    }
  }, []);

  const handleScoreChange = (id: string, newScore: string) => {
    newScore = newScore.replace(",", ".");
    let newScoreNb = parseFloat(newScore);
    (!/^\d*\.?\d*$/.test(newScore) || newScore.length === 0) &&
      (newScoreNb = NaN);
    newScore.length === 0 && (newScoreNb = NaN);

    let updatedScore = evalRating;
    if (
      (isNaN(newScoreNb) ||
        newScoreNb < parseInt(scale.min as string) ||
        newScoreNb > parseInt(scale.max as string)) &&
      newScore !== ""
    ) {
      updatedScore = evalRating.map((rate: Rating) =>
        rate._id.toString() === id ? { ...rate, score: "N/A" } : rate
      );
      if (!toast.isActive("invalid score")) {
        toast.warn(
          `La note doit être comprise entre ${scale.min} et ${scale.max}`,
          {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            draggable: true,
            className: "w-60 mt-1 mr-3 select-none",
            toastId: "invalid score",
          }
        );
      }
      return;
    } else {
      updatedScore = evalRating.map((rate: Rating) => {
        if (!Number.isNaN(newScoreNb) && !newScore.endsWith(".")) {
          newScore = newScoreNb.toString();
        } else {
          newScore = newScore.endsWith(".") ? newScore : "N/A";
        }
        return rate._id.toString() === id
          ? {
              ...rate,
              score: newScore,
              abs: newScore === "Abs",
            }
          : rate;
      });
    }
    setEvalRating(updatedScore);
  };

  const changeNc = (id: string) => {
    const updatedScore = evalRating.map((rate: any) =>
      rate._id === id
        ? { ...rate, score: "N.C", nc: rate.nc ? !rate.nc : true }
        : rate
    );
    setEvalRating(updatedScore);
  };

  const saveRates = async () => {
    let sendData = true;
    evalRating.forEach(async (rate: Rating) => {
      if (rate.score === "N/A" && rate.nc !== true && rate.abs !== true) {
        sendData = false;
      }
      rate.score = rate.score.endsWith(".")
        ? rate.score.slice(0, -1)
        : rate.score;
    });
    if (!sendData) {
      if (!toast.isActive("complete all rate")) {
        toast.warn("Veuillez renseigner toutes les notes avant de valider", {
          toastId: "complete all rate",
        });
      }
      return;
    }
    const response = await fetch("/api/evaluation/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { evalRating, groupId, teacherId, date } }),
    });
    if (response.ok) {
      if (!toast.isActive("success save notes")) {
        toast.success("Les notes ont été enregistrées avec succès", {
          type: "success",
          toastId: "success save notes",
        });
      }
      router.push("/evaluations/list");
    } else {
      if (!toast.isActive("error save notes")) {
        toast("Une erreur s'est produite lors de l'enregistrement des notes", {
          type: "error",
          toastId: "error save notes",
        });
      }
    }
  };

  function truncateName(name: string, maxLength: number) {
    if (!name) return "undefined"; // <-- changer "John Doe" en "undefined"
    if (name.length <= maxLength) return name;
    const truncated = name.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    return lastSpaceIndex === -1 ? "" : truncated.slice(0, lastSpaceIndex);
  }

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
      <div className="px-10 py-6">
        <HeaderWithRecapButton
          title="Feuille d’évaluation"
          groupRecap={groupsStatistics}
        />
      </div>
      <div className="-mt-4">
        <h1 className="text-xl font-bold text-center">{sheetTitle}</h1>
        <p className="text-md font-semibold text-center">
          {formatTitle(groupTitle).dateTime}
        </p>
      </div>
      <div className="flex flex-col mt-2 overflow-y-auto max-h-[65vh] overflow-x-hidden mx-4">
        <div className="text-[14px] font-semibold text-gray-500">
          <div className="grid grid-cols-6 items-center border-b border-gray-200">
            <div className="col-span-4 py-2">Liste des étudiants</div>
            <div className="text-center py-2 border-gray-200">Note</div>
            <div className="text-center py-2 border-gray-200">N.C</div>
          </div>
        </div>
        {evalRating?.length > 0 &&
          evalRating.map((rate: Rating) => {
            const id = rate._id.toString();
            return (
              <div key={id} className="mx-auto">
                <div className="grid grid-cols-6 items-center">
                  <div
                    className="bg-white px-3 py-3 col-span-4 border-b border-gray-200"
                    style={{
                      backgroundColor: rate.score === "Abs" ? "white" : "white",
                    }}
                    onClick={() => {
                      setSelectedRateId(rate);
                      setModalToDisplay("addAppreciation");
                      rate.appreciation
                        ? setAppreciation(rate.appreciation?.toString())
                        : setAppreciation("");
                    }}
                  >
                    <p className="text-[14px] font-semibold">
                      {truncateName(
                        rate.studentName?.toString() || "undefined",
                        25
                      )}
                    </p>
                  </div>
                  <div className="relative border-b border-gray-200">
                    <div className="absolute left-0 top-[6px] bottom-[6px] border-l border-gray-200"></div>
                    <div className="absolute right-0 top-[6px] bottom-[6px] border-r border-gray-200"></div>
                    <input
                      type="text"
                      disabled={!!rate.nc}
                      value={
                        (rate.score !== "N/A" && rate.score.toString()) || ""
                      }
                      className="w-full h-full px-3 py-3 text-[14px] font-semibold text-center outline-none"
                      onChange={(e) => {
                        const updatedScore = e.target.value;
                        handleScoreChange(id, updatedScore);
                      }}
                      style={{
                        color:
                          rate.score === "Abs" ? "rgb(239 68 68)" : "black",
                        cursor:
                          rate.score === "Abs" || !!rate.nc
                            ? "not-allowed"
                            : "text",
                      }}
                    />
                  </div>
                  {rate.abs ? (
                    <div className="flex items-center justify-center border-b border-gray-200 h-full">
                      <Image
                        src="/assets/evaluations.svg"
                        alt="edit icon"
                        width={20}
                        height={20}
                        onClick={() => handleScoreChange(id, "")}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center border-b border-gray-200 h-full">
                      <input
                        type="checkbox"
                        checked={!!rate.nc || false}
                        className="w-5 h-5 cursor-pointer"
                        onChange={() => {
                          changeNc(id);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <Button
          className="w-fit mx-auto mb-5 z-10"
          variant="green"
          onClick={() => setModalToDisplay("SendDate")}
        >
          Valider la saisie des notes
        </Button>
      </div>
      <EvalAppreciationModal
        isOpen={modalToDisplay === "addAppreciation"}
        onClose={onClickCancel}
        appreciation={appreciation}
        setAppreciation={setAppreciation}
        onConfirm={addAppreciation}
      />

      <SendEvalDateModal
        isOpen={modalToDisplay === "SendDate"}
        onClose={onClickCancel}
        date={date}
        setDate={setDate}
        onConfirm={async (e) => {
          (e.target as HTMLButtonElement).disabled = true;
          saveRates();
        }}
      />
    </div>
  );
};

export default FeuillePage;
