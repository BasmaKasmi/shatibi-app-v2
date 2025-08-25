"use client";

import Button from "@/components/Button";
import Emargement from "@/components/Emargement";
import SectionTitle from "@/components/SectionTitle";
import NextCourse from "@/components/NextCourse";
import { displayToday } from "@/lib/dates";
import { groupEmargementsByDate } from "@/lib/emargements";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import FloatingMenu from "@/components/FloatingMenu";
import DeclareAp from "@/components/DeclareAp";
import {
  ApiResponse,
  Course,
  DateList,
  FlattenedCourse,
  getUserInfo,
} from "@/api/index";
import { Modal } from "@mantine/core";
import { EmargementDate, EmargementGroup, UserInfo } from "@/api/index";
import { useDisclosure } from "@mantine/hooks";
import { sortEmargementsByDateDesc } from "@/lib/format-utils";
import { getEmargementsNonFaits, getNextCourse } from "@/api/index";
import { QUERY_KEY } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useTeacher } from "../TeacherContext";
import { useLocalStorage } from "react-use";
import BottomMenu from "@/components/BottomMenu";
import {
  LOCAL_STORAGE_LOGIN_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
} from "@/lib/local-storage-keys";

export default function Home() {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { teacherId } = useTeacher();
  const [isClient, setIsClient] = useState(false);
  const [userInfoStored, setUserInfoStored] = useLocalStorage<string>(
    LOCAL_STORAGE_USER_INFO_KEY
  );
  const [storedLogin] = useLocalStorage<string>(LOCAL_STORAGE_LOGIN_KEY);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("Redirection vers l'espace étudiant depuis Home.tsx");
      router.push("/home-student");
      return;
    }
  }, [router]);

  useEffect(() => {
    const refreshHomeData = async () => {
      if (!teacherId || !storedLogin) return;

      try {
        console.log("Reloading fresh user data on Home page");
        const userData = await getUserInfo(storedLogin);

        if (userData.result) {
          setUserInfoStored(JSON.stringify(userData.result));

          const storedUserInfo = userData.result;
          const adultInfo = storedUserInfo.adult?.info;
          const childInfo = storedUserInfo.child?.info;

          if (
            storedUserInfo.child.access === "oui" &&
            storedUserInfo.adult.access === "oui"
          ) {
            if (!adultInfo.id && childInfo.id) {
              setUserInfo(childInfo);
            } else if (!childInfo.id && adultInfo.id) {
              setUserInfo(adultInfo);
            } else if (adultInfo.id && childInfo.id) {
              setUserInfo(adultInfo);
            }
          } else if (
            storedUserInfo.child.access === "oui" &&
            storedUserInfo.adult.access === "non"
          ) {
            if (childInfo) {
              setUserInfo(childInfo);
            }
          } else if (adultInfo) {
            setUserInfo(adultInfo);
          }
        }
      } catch (error) {
        console.error("Error reloading user data on Home:", error);
      }
    };

    refreshHomeData();
  }, [teacherId, storedLogin, setUserInfoStored]);

  const getFlattenedNextCourses = (
    nextCourseApiResult: ApiResponse<Course[]>
  ): FlattenedCourse[] => {
    try {
      const flatCourses = nextCourseApiResult.result
        .map((course: Course) =>
          course.date_list.map((dateItem: DateList) => ({
            id: course.id,
            name: course.name,
            start_time: dateItem.start_time,
            end_time: dateItem.end_time,
            session: dateItem.session,
            validate: dateItem.validate,
            slot: course.slot,
            classroom: course.classroom,
            date: dateItem.date,
          }))
        )
        .flat();

      const sortedCourses = flatCourses.sort(
        (a: FlattenedCourse, b: FlattenedCourse) =>
          a.start_time.localeCompare(b.start_time)
      );

      return sortedCourses;
    } catch {
      return [];
    }
  };

  const {
    data: nextCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.NEXT_COURSE, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getNextCourse(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });

  const flattenedAndSortedCourses = nextCourses
    ? getFlattenedNextCourses(nextCourses)
    : [];

  const {
    data: emargementsData,
    isLoading: isLoadingEmargements,
    isError: isErrorEmargements,
  } = useQuery({
    queryKey: [QUERY_KEY.EMARGEMENT_NON_FAIT, teacherId],
    queryFn: () => {
      if (teacherId !== null) {
        return getEmargementsNonFaits(teacherId);
      } else {
        throw new Error("teacherId is null");
      }
    },
    enabled: teacherId !== null,
  });

  const emargementsNonFaitsGroupedByCourse = emargementsData?.result ?? [];

  const emargementsNonFaitsAsFlatList = emargementsNonFaitsGroupedByCourse
    .map((group: EmargementGroup) =>
      group.date_list.map((dateItem: EmargementDate) => ({
        date: dateItem.date,
        time: dateItem.time,
        session: dateItem.session,
        id: group.id,
        name: group.name,
        slot: group.slot,
      }))
    )
    .flat()
    .sort((a: EmargementDate, b: EmargementDate) => {
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;

      return dateTimeB.localeCompare(dateTimeA);
    });

  const emargementsTri = sortEmargementsByDateDesc(
    emargementsNonFaitsAsFlatList
  );

  const emargementsNonFaitsGroupedByDate =
    groupEmargementsByDate(emargementsTri);

  let firstEmargementNonFait: any;

  if (Object.keys(emargementsNonFaitsGroupedByDate).length > 0) {
    firstEmargementNonFait =
      emargementsNonFaitsGroupedByDate[
        Object.keys(emargementsNonFaitsGroupedByDate)[0]
      ][0];
  }

  if (!isClient) return null;

  if (isLoading) {
    return <p className="pl-6">Chargement...</p>;
  }

  return (
    <div className="md:hidden overflow-hidden">
      <Modal
        id="declare-ap"
        opened={opened}
        onClose={close}
        withCloseButton={false}
        radius="lg"
        centered
      >
        <DeclareAp />

        <div className="flex justify-end mt-4">
          <Button
            className="text-shatibi-red bg-shatibi-light-red font-bold py-2 px-8 rounded-full"
            onClick={close}
            variant="red"
          >
            Annuler
          </Button>
        </div>
      </Modal>

      <div className="h-dvh flex flex-col relative">
        <FloatingMenu />

        <div className="flex flex-col h-full">
          <div className="pt-3">
            <SectionTitle title="Tableau de bord" />
          </div>
          <div className="flex flex-col p-5 gap-3 pt-6">
            <div className="pl-3">
              <h2 className="font-semibold text-2xl">
                Bonjour Pr. {userInfo ? userInfo.firstname : "Loading..."}
              </h2>
              <p className="font-normal text-sm pl-0.5">
                Bienvenue dans votre espace personnel
              </p>
            </div>
            <div
              className={`rounded-xl p-4 shadow-md ${
                emargementsNonFaitsAsFlatList.length > 0
                  ? "bg-shatibi-red/[.30]"
                  : "bg-white"
              }`}
            >
              <h2 className=" text-center mb-4 font-semibold text-sm">
                {emargementsNonFaitsAsFlatList.length} Emargements non faits
              </h2>
              {firstEmargementNonFait ? (
                <Emargement
                  onClick={() =>
                    // @ts-ignore
                    router.push(
                      `emargement?groupId=${firstEmargementNonFait.id}&date=${firstEmargementNonFait.date}&groupName=${firstEmargementNonFait.name}&groupSlot=${firstEmargementNonFait.slot}`
                    )
                  }
                  emargement={firstEmargementNonFait}
                />
              ) : (
                <div className="flex justify-center items-center">
                  <span className="mx-auto">Aucun émargement non fait</span>
                </div>
              )}
              {emargementsNonFaitsAsFlatList.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={() =>
                      // @ts-ignore
                      router.push(`/unmade-attendance`)
                    }
                  >
                    <h2 className="text-center my-auto font-semibold text-sm">
                      Voir la liste
                    </h2>
                  </button>
                </div>
              )}
            </div>

            <h3 className=" font-semibold text-lg pl-4 pt-4">
              {displayToday()}
            </h3>

            <div className="flex-grow overflow-y-auto h-42 px-2">
              {!Array.isArray(nextCourses?.result) ||
              nextCourses?.result?.length === 0 ? (
                <p className="text-center mt-4">
                  Pas de cours aujourd&apos;hui
                </p>
              ) : (
                <>
                  {flattenedAndSortedCourses.map((course: FlattenedCourse) => (
                    <NextCourse key={course.id} course={course} />
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="fixed bottom-12 left-0 right-0">
            <Button
              className="w-fit mx-auto mb-12 z-10"
              onClick={() => open()}
              variant="orange"
            >
              Déclarer une absence
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          {/* {Object.entries(emargementsNonFaitsGroupedByDate).map(
            ([date, emargementsForThisDate]) => (
              <div key={String(date)}>
                <h3>{displayDate(date)}</h3>

                {emargementsForThisDate.map((emargement) => (
                  <Emargement key={emargement.date} emargement={emargement} />
                ))}
              </div>
            )
          )} */}
        </div>
      </div>
      <BottomMenu />
    </div>
  );
}
