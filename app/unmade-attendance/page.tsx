"use client";
import { useRouter } from "next/navigation";
import Emargement from "@/components/Emargement";
import { useQuery } from "@tanstack/react-query";
import { getEmargementsNonFaits } from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "../TeacherContext";
import EvaluationHeader from "@/components/EvaluationHeader";

const UnmadeAttendancePage = () => {
  const router = useRouter();
  const { teacherId, setTeacherId } = useTeacher();

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
    .map(({ date_list, id, name, slot }: any) =>
      date_list.map(({ date, time, session }: any) => ({
        date,
        time,
        session,
        id,
        name,
        slot,
      }))
    )
    .flat()
    .sort((a: any, b: any) => {
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;

      return dateTimeB.localeCompare(dateTimeA);
    });

  const emargementsTri = emargementsNonFaitsAsFlatList;

  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <div className="px-5 py-4">
        <EvaluationHeader title="Emargement" />
      </div>
      <div className="flex flex-col p-5">
        <div className="bg-shatibi-red/[.30] rounded-xl p-3 mt-2">
          <h2 className="text-center font-semibold text-m m-2">
            {emargementsNonFaitsAsFlatList.length} Emargements non faits
          </h2>
          <div className="flex flex-col gap-1 p-2 overflow-y-auto max-h-[70vh]">
            {emargementsTri.map((emargement: any) => (
              <Emargement
                key={`${emargement.id}-${emargement.date}-${emargement.time}`}
                emargement={emargement}
                onClick={() =>
                  // @ts-ignore
                  router.push(
                    `emargement?groupId=${emargement.id}&date=${emargement.date}&groupName=${emargement.name}&groupSlot=${emargement.slot}`
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnmadeAttendancePage;
