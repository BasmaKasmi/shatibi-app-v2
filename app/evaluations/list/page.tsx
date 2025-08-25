"use client";

import { useQuery } from "@tanstack/react-query";
import { EvalSheet, Group, getGroups } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTeacher } from "@/app/TeacherContext";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import evalSheetStatuts from "@/utils/evalSheetStatuts";
import Image from "next/image";
import CollectiveAssessmentForm from "@/components/CollectiveAssessmentForm";
import { Modal } from "@mantine/core";
import { toast } from "react-toastify";
import EvaluationHeader from "@/components/EvaluationHeader";
import SelectEvalTypeModal from "@/components/SelectEvalTypeModal";
import Button from "@/components/Button";
import validate from "@/public/validation.svg";

const ListPage = () => {
  const { teacherId } = useTeacher();
  const router = useRouter();
  const [evalSheets, setEvalSheets] = useState<EvalSheet[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [modalToDisplay, setModalToDisplay] = useState<String>("");
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [collectiveModalOpened, setCollectiveModalOpened] = useState(false);
  const [statuts, setStatuts] = useState([
    "À venir",
    "À saisir",
    "Remplis",
    "Transmise",
  ]);

  const [upcomingEvals, setUpcomingEvals] = useState<EvalSheet[]>([]);
  const [pastEvals, setPastEvals] = useState<EvalSheet[]>([]);

  const filterEvaluations = (sheets: EvalSheet[]) => {
    const now = dayjs();

    const upcoming = sheets.filter((sheet) =>
      dayjs(sheet.passageDate).isAfter(now)
    );

    const past = sheets.filter(
      (sheet) =>
        dayjs(sheet.passageDate).isBefore(now) ||
        dayjs(sheet.passageDate).isSame(now)
    );

    setUpcomingEvals(upcoming);
    setPastEvals(past);
  };

  useEffect(() => {
    filterEvaluations(evalSheets);
  }, [evalSheets]);

  const handleStatusChange = (status: string) => {
    setStatuts((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const onClickCancel = () => {
    setModalToDisplay("");
    setSelectedSheetId(null);
  };

  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery<Group[], Error>({
    queryKey: [QUERY_KEY.GROUPS, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getGroups(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });

  const groupIds = groups ? groups.map((grp) => grp.id).join(",") : "";

  useEffect(() => {
    if (groupIds.length > 0) {
      const getSheets = async () => {
        try {
          const response = await fetch(
            "/api/evaluation/feuille?groupIds=" + groupIds,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );
          const res = await response.json();

          const sheets = res?.data || [];

          const sortedEvalSheets =
            sheets.length > 0
              ? sheets.sort((a: EvalSheet, b: EvalSheet) => {
                  if (a.statut === "À venir" && b.statut !== "À venir")
                    return -1;
                  if (a.statut !== "À venir" && b.statut === "À venir")
                    return 1;
                  return 0;
                })
              : [];

          setEvalSheets(sortedEvalSheets);
        } catch (error) {
          console.error("Erreur lors de la récupération des feuilles:", error);
          setEvalSheets([]);
        }
      };

      getSheets();
    }
  }, [groupIds, lastUpdate]);

  useEffect(() => {
    if (openMenu !== null) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if the click is outside the menu
        if (!target.closest(`[id="${openMenu}"]`)) {
          setOpenMenu(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        // Cleanup the event listener on unmount
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenu]);

  const handleToggle = (id: any) => {
    if (openMenu === id) {
      setOpenMenu(null);
    } else {
      setOpenMenu(id);
    }
  };

  const evalSupp = async () => {
    if (!selectedSheetId) {
      if (!toast.isActive("evalSheetDeleted")) {
        toast.error(
          "une erreur est survenue lors de la suppression de l'évaluation",
          {
            toastId: "evalSheetDeleted",
          }
        );
      }
      return;
    }
    const response = await fetch(`/api/evaluation/feuille`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        evalSheetIds: [selectedSheetId],
        definitely: true,
      }),
      cache: "no-store",
    });
    const res = await response.json();
    if (res.modifiedCount > 0 || res.deletedCount > 0) {
      setLastUpdate(new Date());
      setModalToDisplay("");

      if (!toast.isActive("evalSheetDeleted")) {
        toast.success("L'évaluation a bien été supprimée", {
          toastId: "evalSheetDeleted",
        });
      }
    }
  };

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Liste des évaluations" />
      </div>
      <div className="text-xs">
        <p className="ml-6 mb-1">Trier par statut :</p>
        <div className="flex flex-wrap justify-center items-center mx-2 whitespace-nowrap">
          {evalSheetStatuts.map((status) => (
            <label
              className="flex items-center ml-4 first:ml-0 my-1 cursor-pointer"
              key={status.label}
            >
              <input
                type="checkbox"
                checked={statuts.includes(status.label)}
                onChange={() => handleStatusChange(status.label)}
                className="w-4 h-4 rounded mr-1"
              />
              <span className="font-semibold">{status.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto h-[75vh] overflow-x-hidden">
        <div className="mb-6">
          {upcomingEvals?.length > 0 ? (
            upcomingEvals.map((evalSheet: any) => {
              if (!statuts.includes(evalSheet.statut)) return null;
              let statut: any;
              evalSheetStatuts.map(
                (EvalStatut) =>
                  EvalStatut.label == evalSheet.statut && (statut = EvalStatut)
              );
              const id = evalSheet._id;
              const group = groups.find((grp) => grp.id == evalSheet.groupId);
              let groupNameSplit = group?.name.split(" ") || [];
              groupNameSplit.shift();
              const groupName = groupNameSplit.join(" ");
              const groupTitle = group
                ? groupName +
                  " - " +
                  group.slot.replace("-", " à ") +
                  " le " +
                  dayjs(evalSheet.passageDate).format("DD/MM/YYYY")
                : "";

              return (
                <div key={id}>
                  <div
                    className="pl-4 pr-2 py-2 bg-white shadow-md rounded-xl w-[90%] mb-3 mx-auto grid grid-cols-10 gap-2 items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      Cookies.set("scale", JSON.stringify(evalSheet.scaleId));
                      router.push(
                        `/evaluations/feuille/${id}?groupTitle=${groupTitle}&groupId=${
                          evalSheet.groupId
                        }&teacherId=${teacherId}&sheetTitle=${
                          evalSheet.modId.title
                        }${" " + evalSheet.subject || ""}`
                      );
                    }}
                  >
                    <div className="col-span-6 w-full">
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {evalSheet.modId.title} {evalSheet.subject}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: "300" }}>
                        {groupTitle && <p>{groupTitle}</p>}
                      </span>
                    </div>

                    <span
                      className="text-xs font-medium rounded-full text-center col-span-3 min-w-[90] py-1 px-auto"
                      style={{
                        color: statut.color,
                        background: statut.bgColor,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {evalSheet.statut}
                    </span>

                    <span
                      id={id}
                      className="col-span-1 mx-1 text-xs font-medium w-full h-full flex justify-center items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(id);
                      }}
                    >
                      {statut.label !== "Transmise" && (
                        <Image
                          src="/assets/down-button.svg"
                          alt="ouvrir le menu"
                          width={24}
                          height={24}
                          className="pt-1"
                        />
                      )}
                      {openMenu === id && (
                        <div
                          className="relative"
                          style={{
                            top: "-16px",
                            right: "-7px",
                            cursor: "default",
                          }}
                        >
                          <div className="absolute right-0 top-0 w-52 bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col">
                              <div className="flex justify-end">
                                <button className="w-10 h-6 flex items-center justify-center rounded-lg">
                                  <Image
                                    src="/assets/down-button.svg"
                                    alt="Fermer le menu"
                                    width={24}
                                    height={24}
                                    className="transform rotate-180 pt-1"
                                  />
                                </button>
                              </div>
                              <div className="flex flex-col gap-1 px-4 py-2">
                                <button
                                  onClick={(e) => {
                                    setModalToDisplay(
                                      "ModifyCollectiveAssessment"
                                    );
                                    setSelectedSheetId(id);
                                  }}
                                  className="w-full text-left py-2 text-sm text-black font-bold flex items-center"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={(e) => {
                                    setModalToDisplay(
                                      "DeleteCollectiveAssessment"
                                    );
                                    setSelectedSheetId(id);
                                  }}
                                  className="w-full text-left py-2 text-sm text-black font-bold flex items-center"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-5 text-sm">
              Aucune évaluation à venir
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-center my-6 w-full">
            <div className="flex-grow h-[1px] bg-gray-300 max-w-[35%] ml-4 mr-2"></div>
            <h3 className="text-sm font-semibold px-2 text-gray-500">
              Évaluations passées
            </h3>
            <div className="flex-grow h-[1px] bg-gray-300 max-w-[35%] ml-2 mr-4"></div>
          </div>
          {pastEvals?.length > 0 ? (
            pastEvals.map((evalSheet: any) => {
              if (!statuts.includes(evalSheet.statut)) return null;
              let statut: any;
              evalSheetStatuts.map(
                (EvalStatut) =>
                  EvalStatut.label == evalSheet.statut && (statut = EvalStatut)
              );
              const id = evalSheet._id;
              const group = groups.find((grp) => grp.id == evalSheet.groupId);
              let groupNameSplit = group?.name.split(" ") || [];
              groupNameSplit.shift();
              const groupName = groupNameSplit.join(" ");
              const groupTitle = group
                ? groupName +
                  " - " +
                  group.slot.replace("-", " à ") +
                  " le " +
                  dayjs(evalSheet.passageDate).format("DD/MM/YYYY")
                : "";

              return (
                <div key={id}>
                  <div
                    className="pl-4 pr-2 py-2 bg-white shadow-md rounded-xl w-[90%] mb-3 mx-auto grid grid-cols-10 gap-2 items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      Cookies.set("scale", JSON.stringify(evalSheet.scaleId));
                      router.push(
                        `/evaluations/feuille/${id}?groupTitle=${groupTitle}&groupId=${
                          evalSheet.groupId
                        }&teacherId=${teacherId}&sheetTitle=${
                          evalSheet.modId.title
                        }${" " + evalSheet.subject || ""}`
                      );
                    }}
                  >
                    <div className="col-span-6 w-full">
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {evalSheet.modId.title} {evalSheet.subject}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: "300" }}>
                        {groupTitle && <p>{groupTitle}</p>}
                      </span>
                    </div>

                    <span
                      className="text-xs font-medium rounded-full text-center col-span-3 min-w-[90] py-1 px-auto"
                      style={{
                        color: statut.color,
                        background: statut.bgColor,
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {evalSheet.statut}
                    </span>

                    <span
                      id={id}
                      className="col-span-1 mx-1 text-xs font-medium w-full h-full flex justify-center items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(id);
                      }}
                    >
                      {statut.label !== "Transmise" && (
                        <Image
                          src="/assets/down-button.svg"
                          alt="ouvrir le menu"
                          width={24}
                          height={24}
                          className="pt-1"
                        />
                      )}
                      {openMenu === id && (
                        <div
                          className="relative"
                          style={{
                            top: "-16px",
                            right: "-7px",
                            cursor: "default",
                          }}
                        >
                          <div className="absolute right-0 top-0 w-52 bg-white rounded-lg shadow-lg">
                            <div className="flex flex-col">
                              <div className="flex justify-end">
                                <button className="w-10 h-6 flex items-center justify-center rounded-lg">
                                  <Image
                                    src="/assets/down-button.svg"
                                    alt="Fermer le menu"
                                    width={24}
                                    height={24}
                                    className="transform rotate-180 pt-1"
                                  />
                                </button>
                              </div>
                              <div className="flex flex-col gap-1 px-4 py-2">
                                <button
                                  onClick={(e) => {
                                    setModalToDisplay(
                                      "ModifyCollectiveAssessment"
                                    );
                                    setSelectedSheetId(id);
                                  }}
                                  className="w-full text-left py-2 text-sm text-black font-bold flex items-center"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={(e) => {
                                    setModalToDisplay(
                                      "DeleteCollectiveAssessment"
                                    );
                                    setSelectedSheetId(id);
                                  }}
                                  className="w-full text-left py-2 text-sm text-black font-bold flex items-center"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-5">Aucune évaluation passée</p>
          )}
        </div>
      </div>
      <div className="w-full bg-white py-3">
        <Button
          className="mx-auto block font-bold"
          variant="orange"
          onClick={() => setModalOpened(true)}
        >
          Ajouter une évaluation
        </Button>
      </div>

      <SelectEvalTypeModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSelectType={() => {
          setModalOpened(false);
        }}
        onOpenCollectiveModal={() => setCollectiveModalOpened(true)}
      />

      <Modal
        centered
        opened={modalToDisplay === "ModifyCollectiveAssessment"}
        withCloseButton={false}
        radius="lg"
        onClose={() => {}}
      >
        <CollectiveAssessmentForm
          onClickCancel={onClickCancel}
          type="modif"
          sheet={
            selectedSheetId && evalSheets
              ? evalSheets.find((e: EvalSheet) => e._id === selectedSheetId)
              : undefined
          }
          setLastUpdate={setLastUpdate}
        />
      </Modal>

      <Modal
        centered
        opened={modalToDisplay === "DeleteCollectiveAssessment"}
        withCloseButton={false}
        radius="lg"
        onClose={() => {}}
      >
        <>
          <div className="flex justify-center items-center">
            <Image
              src={validate}
              alt="validation icon"
              width={50}
              height={50}
            />
          </div>
          <h2 className="text-center text-lg font-semibold text-black my-2">
            Souhaitez-vous supprimer l&apos;évaluation ?
          </h2>

          <div className="flex gap-2 items-center justify-center">
            <div className="flex justify-center items-center gap-6 w-full mt-4">
              <Button
                className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
                variant="red"
                onClick={() => onClickCancel()}
              >
                Retour
              </Button>
              <Button
                className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
                variant="green"
                onClick={async () => await evalSupp()}
              >
                Valider
              </Button>
            </div>
          </div>
        </>
      </Modal>

      <Modal
        centered
        opened={collectiveModalOpened}
        withCloseButton={false}
        radius="lg"
        onClose={() => setCollectiveModalOpened(false)}
      >
        <CollectiveAssessmentForm
          onClickCancel={() => setCollectiveModalOpened(false)}
          type="créa"
          setLastUpdate={setLastUpdate}
        />
      </Modal>
    </div>
  );
};

export default ListPage;
