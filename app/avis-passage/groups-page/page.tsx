"use client";

import { useRouter } from "next/navigation";
import FloatingMenu from "@/components/FloatingMenu";
import SectionTitle from "@/components/SectionTitle";
import { useTeacher } from "@/app/TeacherContext";
import BottomMenu from "@/components/BottomMenu";
import GroupByTeacher from "@/components/GroupsByTeacher";

const GroupsPage = () => {
  const router = useRouter();
  const { teacherId } = useTeacher();

  return (
    <div className="h-dvh flex flex-col gap-3 relative overflow-hidden">
      <FloatingMenu />
      <div className="pt-3">
        <SectionTitle title="Évaluations" />
      </div>
      <GroupByTeacher teacherId={teacherId} destinationPage="student-page" />
      <BottomMenu />
    </div>
  );
};

export default GroupsPage;
