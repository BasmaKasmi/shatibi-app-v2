import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { NativeSelect, TextInput } from "@mantine/core";
import Image from "next/image";
import { toast } from "react-toastify";
import { useTeacher } from "@/app/TeacherContext";
import CustomDateInput from "@/components/CustomDateInput/CustomDateInput";
import { Attendance, getAttendanceList } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/queries";
import dayjs from "dayjs";

const CollectiveAssessmentForm = ({
  onClickCancel,
  type,
  sheet,
  setLastUpdate,
}: any) => {
  const { teacherId } = useTeacher();
  const [loadingMod, setloadingMod] = useState(true);
  const [loadingBar, setloadingBar] = useState(true);
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [errEvalMod, setErrEvalMod] = useState("");
  const [errEvalBar, setErrEvalBar] = useState("");
  const [EvalMod, setEvalMod] = useState<[]>([]);
  const [EvalModNames, setEvalModNames] = useState<string[]>([]);
  const [EvalModName, setEvalModName] = useState("");
  const [EvalBar, setEvalBar] = useState<[]>([]);
  const [EvalBarNames, setEvalBarNames] = useState<string[]>([]);
  const [EvalBarName, setEvalBarName] = useState("");
  const [date, setDate] = useState<Date>(
    sheet?.passageDate ? new Date(sheet?.passageDate) : new Date()
  );
  const [subject, setSubject] = useState(sheet?.subject || "");
  const search = useSearchParams();
  const groupId = sheet?.groupId || Number(search.get("groupId")) || -1;

  const commonSelectStyles = {
    input: {
      height: "36px",
      borderRadius: "10px",
      padding: "0 16px",
      paddingTop: "2px",
      border: "1px solid #E5E7EB",
      width: "7rem",
      fontSize: "14px",
      fontWeight: 500,
      color: "#1F2937",
      backgroundColor: "white",
      lineHeight: "32px",
      "&:focus": {
        borderColor: "#E5E7EB",
      },
      "&::placeholder": {
        color: "#9CA3AF",
      },
    },
    rightSection: {
      width: "32px",
      pointerEvents: "none",
      paddingRight: "8px",
    },
    wrapper: {
      height: "36px",
    },
  };

  const fetchEvalModalite = async () => {
    setloadingMod(true);
    try {
      const response = await fetch("/api/evaluation/modalite");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      setEvalMod(result.data);
      const eMN = result.data.map((eM: any) => eM.title);
      setEvalModNames(eMN);
      setEvalModName(sheet?.modId?.title || eMN[0] || "");
    } catch (error) {
      if (error instanceof Error) {
        setErrEvalMod(error.message);
      } else {
        setErrEvalMod("Une erreur inconnue est survenue");
      }
    } finally {
      setloadingMod(false);
    }
  };

  const fetchEvalBareme = async () => {
    setloadingBar(true);
    try {
      const response = await fetch("/api/evaluation/bareme");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      setEvalBar(result.data);
      const eBN = result.data.map((eB: any) => eB.name);
      setEvalBarNames(eBN);
      setEvalBarName(sheet?.scaleId?.subject || eBN[0] || "");
    } catch (error) {
      if (error instanceof Error) {
        setErrEvalBar(error.message);
      } else {
        setErrEvalBar("Une erreur inconnue est survenue");
      }
    } finally {
      setloadingBar(false);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchEvalBareme(), fetchEvalModalite()]);
    })();
  }, []);

  const startDate = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toDateString();
  const endDate = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toDateString();

  const { data: attendanceList } = useQuery<Attendance[], Error>({
    queryKey: [
      QUERY_KEY.ATTENDANCE_LIST,
      groupId,
      startDate,
      endDate,
      teacherId,
    ],
    queryFn: () => {
      if (teacherId === null) {
        throw new Error("Teacher ID is not available.");
      }
      return getAttendanceList(groupId, teacherId, startDate, endDate);
    },
    enabled:
      !!groupId &&
      !!teacherId &&
      (startDate !== undefined || endDate !== undefined),
  });

  const handleSubmit = async () => {
    if (loadingValidation) return;

    if (subject.length <= 0) {
      if (!toast.isActive("errSubject")) {
        toast.warn("Veuillez saisir un sujet", { toastId: "errSubject" });
      }
      return;
    }

    const formatedDate = dayjs(date).format("YYYY-MM-DD");
    const hasAttendance = attendanceList?.some(
      (attendance) => attendance.date === formatedDate
    );

    if (!hasAttendance) {
      if (!toast.isActive("errDate")) {
        toast.warn("Aucun cours n'est prévu à cette date pour ce groupe", {
          toastId: "errDate",
        });
      }
      return;
    }

    setLoadingValidation(true);

    const modId = (EvalMod[EvalModNames.indexOf(EvalModName)] as any)._id;
    const scaleId = (EvalBar[EvalBarNames.indexOf(EvalBarName)] as any)._id;
    const data: any = {
      modId,
      subject,
      scaleId,
      groups: [groupId],
      date,
      teacherId,
    };

    if (sheet) {
      data.evalSheetId = sheet._id;
    }

    const method = type === "créa" ? "POST" : "PUT";
    try {
      const response = await fetch("/api/evaluation/feuille", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (!toast.isActive("evalFormValidation")) {
          toast.success(
            `L'évaluation a été ${
              type === "créa" ? "créée" : "modifiée"
            } avec succès`,
            { toastId: "evalFormValidation" }
          );
        }
        onClickCancel();
        setLastUpdate(new Date());
      } else {
        if (!toast.isActive("evalFormValidation")) {
          toast.error(
            `Une erreur est survenue lors de la ${
              type === "créa" ? "création" : "modification"
            } de l'évaluation`,
            { toastId: "evalFormValidation" }
          );
        }
      }
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la communication avec le serveur"
      );
    } finally {
      setLoadingValidation(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-4">
      {!loadingMod && !loadingBar ? (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-center">
            {type === "créa" ? "Création" : "Modification"}
            <br />
            évaluation collective
          </h2>

          <div className="space-y-6 mt-8">
            <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
              <label
                htmlFor="modalityChoice"
                className="text-gray-600 text-md font-semibold"
              >
                Choix de modalité
              </label>
              <div className="w-28">
                <NativeSelect
                  id="modalityChoice"
                  rightSection={
                    <Image
                      src="/arrow-down-select.svg"
                      alt="arrow icon"
                      width={16}
                      height={16}
                    />
                  }
                  data={EvalModNames}
                  value={EvalModName}
                  onChange={(e) => setEvalModName(e.target.value)}
                  styles={commonSelectStyles}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="text-gray-600 text-md font-semibold"
              >
                Sujet de l&apos;évaluation
              </label>
              <TextInput
                id="subject"
                placeholder="Alphabétisation"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                styles={{
                  input: {
                    borderRadius: "10px",
                    padding: "8px 16px",
                    border: "1px solid #E5E7EB",
                    width: "100%",
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
              <label
                htmlFor="gradingScale"
                className="text-gray-600 text-md font-semibold"
              >
                Barème de notation
              </label>
              <div className="w-28">
                <NativeSelect
                  id="gradingScale"
                  rightSection={
                    <Image
                      src="/arrow-down-select.svg"
                      alt="arrow icon"
                      width={16}
                      height={16}
                    />
                  }
                  data={EvalBarNames}
                  value={EvalBarName}
                  onChange={(e) => setEvalBarName(e.target.value)}
                  styles={commonSelectStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
              <label
                htmlFor="examDate"
                className="text-gray-600 text-md font-semibold"
              >
                Date de passage
              </label>
              <div>
                <CustomDateInput date={date} setDate={setDate} />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 w-full mt-4">
            <Button
              className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
              variant="red"
              onClick={onClickCancel}
            >
              Annuler
            </Button>
            <Button
              className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
              variant="green"
              onClick={handleSubmit}
              disabled={
                loadingValidation ||
                EvalModName.length <= 0 ||
                EvalBarName.length <= 0
              }
            >
              Valider
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CollectiveAssessmentForm;
