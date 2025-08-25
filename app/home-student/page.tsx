"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import FloatingMenu from "@/components/FloatingMenu";
import BottomMenuStudent from "@/components/BottomMenuStudent";
import { useEffect, useState, useCallback } from "react";
import { decodeHtml } from "@/lib/format-utils";
import {
  daysMapping,
  sortGroupsByDayAndTime,
  today,
  todayDay,
  convertSlotToDateString,
} from "@/lib/dates";
import { useQuery } from "@tanstack/react-query";
import {
  Group,
  getStudentsGroups,
  getStudentWorkbookContent,
  getStudentContentList,
} from "@/lib/student-api";
import { QUERY_KEY } from "@/lib/queries";
import Button from "@/components/Button";
import AbsenceWrapper from "@/components/AbsenceWrapper";
import { cleanupTokens } from "@/lib/backend-api";
import StudentRouteGuard from "@/components/StudentRouteGuard";

interface CustomFile {
  name: string;
  base64: string;
  mime: string;
}

interface WorkbookContentFile {
  name: string;
  coUrl: string;
}

interface HomeworkData {
  homework: string;
  hasAttachments: boolean;
  attachments: WorkbookContentFile[];
  date?: string;
  liaisonId?: number;
  validated?: boolean;
}

export default function HomeStudent() {
  const router = useRouter();
  const [firstname, setFirstname] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [unvalidatedHomeworkCount, setUnvalidatedHomeworkCount] = useState(0);
  const studentFirstname = searchParams.get("firstname");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homeworksCount, setHomeworksCount] = useState(0);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [homeworkText, setHomeworkText] = useState<string>("");
  const [homeworkFile, setHomeworkFile] = useState<CustomFile | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [selectedGroupHomework, setSelectedGroupHomework] =
    useState<HomeworkData>({
      homework: "",
      hasAttachments: false,
      attachments: [],
    });
  const [hasHomework, setHasHomework] = useState(false);

  const {
    data: groupsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.STUDENTS_GROUPS, studentId],
    queryFn: async () => {
      if (!studentId || !token) {
        throw new Error("Student ID et token sont requis");
      }
      const response = await getStudentsGroups(studentId, token);
      return response;
    },
    enabled: !!studentId && !!token,
  });

  const { data: allHomeworkData, isLoading: isHomeworkLoading } = useQuery({
    queryKey: [QUERY_KEY.ALL_STUDENT_HOMEWORK, studentId],
    queryFn: async () => {
      if (!studentId || !token || !allGroups.length) {
        return [];
      }

      const homeworkPromises = allGroups.map(async (group) => {
        try {
          const response = await getStudentContentList({
            student_id: studentId,
            token: token,
            group_id: group.id,
          });
          return response.result || [];
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des devoirs pour le groupe ${group.id}:`,
            error
          );
          return [];
        }
      });

      const allHomeworkLists = await Promise.all(homeworkPromises);
      return allHomeworkLists.flat();
    },
    enabled: !!studentId && !!token && allGroups.length > 0,
  });

  const navigateToHomeworkList = (
    group: Group | null = selectedGroup
  ): void => {
    if (!group || !studentId || !token) return;

    router.push(
      `/homework-list?groupId=${group.id}&groupName=${group.name}&groupSlot=${group.slot}&studentId=${studentId}&token=${token}`
    );
  };

  useEffect(() => {
    cleanupTokens();

    if (!localStorage.getItem("token")) {
      console.log(
        "Redirection vers la page de connexion depuis HomeStudent.tsx"
      );
      router.push("/student-login");
      return;
    }
  }, [router]);

  useEffect(() => {
    const storedStudentId = localStorage.getItem("student_id");
    const storedToken = localStorage.getItem("token");
    if (storedStudentId && storedToken) {
      setStudentId(Number(storedStudentId));
      setToken(storedToken);
    } else {
      router.push("/student-login");
    }
  }, [router]);

  useEffect(() => {
    const storedFirstname = localStorage.getItem("firstname");
    if (storedFirstname) {
      setFirstname(storedFirstname);
    } else if (studentFirstname) {
      setFirstname(studentFirstname);
      localStorage.setItem("firstname", studentFirstname);
    } else {
      setFirstname("Etudiant");
    }
  }, [studentFirstname]);

  useEffect(() => {
    const homework =
      searchParams.get("homework") ?? localStorage.getItem("homework");
    const savedHomeworkFile = localStorage.getItem("homeworkFile");
    setHomeworkText(decodeHtml(homework || ""));
    if (savedHomeworkFile) {
      const parsedHomeworkFile = JSON.parse(savedHomeworkFile);
      setHomeworkFile(parsedHomeworkFile);
    }
  }, [searchParams]);

  const fetchSelectedGroupHomework = useCallback(
    async (group: Group): Promise<void> => {
      if (!studentId || !token) return;
      try {
        const groupDate = convertSlotToDateString(group.slot);
        const response = await getStudentWorkbookContent({
          group_id: group.id,
          student_id: studentId,
          date: groupDate,
          token: token,
        });
        if (response.result) {
          const hasHomeworkContent = !!(
            response.result.homework &&
            response.result.homework !== "no_liaison"
          );
          setHasHomework(hasHomeworkContent);
          setSelectedGroupHomework({
            homework: response.result.homework || "",
            hasAttachments: !!(
              response.result.coUrlList && response.result.coUrlList.length > 0
            ),
            attachments: response.result.coUrlList || [],
            liaisonId: response.result.liaison_id,
            validated: response.result.validated,
          });
        }
      } catch (error: any) {
        console.error(`Error fetching homework:`, error);
        if (
          error.status === 401 ||
          (error.response && error.response.status === 401)
        ) {
          console.log(
            "Erreur d'authentification, redirection vers la page de connexion"
          );
          localStorage.removeItem("token");
          localStorage.removeItem("student_id");
          router.push("/student-login");
        }
      }
    },
    [studentId, token, router]
  );

  useEffect(() => {
    if (selectedGroup) {
      fetchSelectedGroupHomework(selectedGroup);
    }
  }, [selectedGroup, studentId, token, fetchSelectedGroupHomework]);

  useEffect(() => {
    if (groupsData?.result?.group_list) {
      setAllGroups(groupsData.result.group_list);
      if (!selectedGroup && groupsData.result.group_list.length > 0) {
        setSelectedGroup(groupsData.result.group_list[0]);
      }
    }
  }, [groupsData, selectedGroup]);

  useEffect(() => {
    if (allHomeworkData) {
      const unvalidatedCount = allHomeworkData.filter(
        (homework) => homework.validated !== "1"
      ).length;

      setUnvalidatedHomeworkCount(unvalidatedCount);
    }
  }, [allHomeworkData]);

  const handleGroupSelection = (group: Group) => {
    setSelectedGroup(group);
    fetchSelectedGroupHomework(group);
  };

  const renderHomeworkContent = (): JSX.Element | null => {
    if (!selectedGroup) return null;

    return (
      <>
        <div
          className="rounded-xl bg-white px-4 py-2 text-sm cursor-pointer"
          onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
            e.stopPropagation();
            navigateToHomeworkList();
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold">{selectedGroup.name}</h3>
              <p className="italic text-shatibi-grey text-xs font-semibold">
                {selectedGroup.slot}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (!studentId) {
    return <div>ID étudiant invalide</div>;
  }
  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur: {error.message}</div>;

  const groups = groupsData?.result?.group_list || [];
  const filteredGroups = groups.filter((group) => {
    const courseDayAbbreviation = group.slot.split(" ")[0];
    if (!daysMapping.hasOwnProperty(courseDayAbbreviation)) {
      return false;
    }
    const courseDay =
      daysMapping[courseDayAbbreviation as keyof typeof daysMapping];
    return courseDay === todayDay;
  });
  const sortedTodayGroups = sortGroupsByDayAndTime(filteredGroups);

  return (
    <StudentRouteGuard>
      <div className="md:hidden overflow-hidden">
        <div className="h-dvh flex flex-col gap-3 relative">
          <FloatingMenu />
          <div className="pt-3">
            <SectionTitle title="Tableau de bord" />
          </div>
          <div className="flex flex-col p-5 gap-3 flex-grow pt-6">
            <div className="pl-3">
              <h2 className="font-semibold text-2xl">Bonjour {firstname}</h2>
              <p className="font-normal text-sm pl-0.5">
                Bienvenue dans votre espace personnel
              </p>
            </div>
            <div
              className={`rounded-xl p-4 shadow-md ${
                unvalidatedHomeworkCount > 0
                  ? "bg-shatibi-red/[.30]"
                  : "bg-white"
              }`}
            >
              <h2 className=" text-center mb-4 font-semibold text-sm">
                <span className="ml-1">{unvalidatedHomeworkCount}</span>
                &nbsp;Devoirs à faire
              </h2>

              {unvalidatedHomeworkCount > 0 ? (
                <>
                  {renderHomeworkContent()}
                  <div className="text-center mt-3">
                    <button
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement>
                      ): void => {
                        e.stopPropagation();
                        navigateToHomeworkList();
                      }}
                    >
                      <h2 className="text-center my-auto font-semibold text-sm">
                        Voir la liste
                      </h2>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center">
                  <span className="mx-auto">Aucun devoir à faire</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg pl-4 mt-6">{today}</h3>
            </div>
            <div className="flex flex-col mt-2 mb-4">
              {sortedTodayGroups.length > 0 ? (
                sortedTodayGroups.map((group) => {
                  const slotTimes = group.slot
                    ? group.slot.split(" ")[1].split("-")
                    : [];
                  const startTime =
                    slotTimes[0] || "Heure de début non définie";
                  const endTime = slotTimes[1] || "Heure de fin non définie";
                  return (
                    <div
                      key={group.id}
                      className={`relative bg-white rounded-lg shadow-md py-3 w-full max-w-lg mx-auto flex items-center my-1 cursor-pointer ${
                        selectedGroup?.id === group.id ? "" : ""
                      }`}
                      onClick={(): void => {
                        handleGroupSelection(group);

                        navigateToHomeworkList(group);
                      }}
                    >
                      <div className="flex items-center mr-4 ml-4">
                        <div className="flex flex-col text-left gap-3">
                          <p className="text-black text-xs font-normal">
                            {startTime}
                          </p>
                          <p className="text-black text-xs font-normal">
                            {endTime}
                          </p>
                        </div>
                      </div>
                      <div className="h-11 w-1 bg-shatibi-orange rounded-lg mr-4"></div>
                      <div className="flex-grow">
                        <p className="text-black text-[14px] font-semibold mb-1">
                          {group.name || "Nom du cours indisponible"}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold italic text-shatibi-orange text-xs">
                            {group.classroom || "Salle non définie"}
                          </p>
                          <p className="text-shatibi-grey font-semibold italic text-xs mr-4">
                            {group.session || "Session non définie"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center mt-4">
                  Pas de cours aujourd&apos;hui
                </p>
              )}
            </div>
          </div>
          <div className="fixed bottom-12 left-0 right-0">
            <Button
              className="w-fit mx-auto mb-12 z-10"
              onClick={() => setIsModalOpen(true)}
              variant="orange"
            >
              Déclarer une absence
            </Button>
          </div>
          <AbsenceWrapper
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            studentId={studentId}
            token={token}
          />
        </div>
        <BottomMenuStudent />
      </div>
    </StudentRouteGuard>
  );
}
