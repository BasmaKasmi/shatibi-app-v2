"use client";

import { useRouter } from "next/navigation";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import GroupsByTeacher from "@/components/GroupsByTeacher";
import SectionTitle from "@/components/SectionTitle";
import FloatingMenu from "@/components/FloatingMenu";

const EvaluationsPage = () => {
  const router = useRouter();
  const { teacherId } = useTeacher();

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
      <FloatingMenu />

      <div className="pt-3">
        <SectionTitle title="Mes évaluations" />
      </div>

      <GroupsByTeacher
        teacherId={teacherId}
        destinationPage="/evaluations/list"
      />
      {/* <div className="fixed bottom-12 left-0 right-0">
        <Button
          className="w-fit mx-auto mb-12 z-10"
          onClick={() => router.push("/evaluations/list")}
          variant="orange"
        >
          Voir la liste des évaluations
        </Button>
      </div> */}
      <BottomMenu />
    </div>
  );
};

export default EvaluationsPage;
