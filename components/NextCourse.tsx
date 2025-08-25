"use client";

import Image from "next/image";
import validation from "@/public/validation-icon.svg";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  start_time: string;
  end_time: string;
  classroom: string;
  session: string;
  total?: number;
  name: string;
  date: string;
  validate: boolean;
  slot: string;
};

type NextCourseProps = {
  course: Course;
};

const NextCourse = ({ course }: NextCourseProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        // @ts-ignore
        router.push(
          `emargement?groupId=${course.id}&date=${course.date}&groupName=${course.name}&groupSlot=${course.slot}`
        )
      }
    >
      <div className="bg-white rounded-xl p-2 shadow-md flex justify-between items-center relative my-2">
        <div className="absolute left-12 h-14 w-1 bg-shatibi-orange rounded-lg-lg"></div>
        <div className="flex flex-col text-left">
          <p className="text-black text-xs font-normal">{course.start_time}</p>
          <p className="text-black text-xs font-normal pt-2">
            {course.end_time}
          </p>
        </div>
        <div className="pl-4 flex-1 overflow-hidden">
          <p className="text-[13px] font-semibold text-left break-words">
            {course.name ? course.name : "Nom du cours indisponible"}
          </p>
          <p className="text-[13px] font-semibold italic text-shatibi-orange text-left">
            {course.classroom}
          </p>
        </div>
        <div className="progression text-xs font-semibold italic mt-10 text-shatibi-grey">
          {course.session}
        </div>
        {course.validate && (
          <div className="absolute top-5 right-4">
            <Image src={validation} alt="Emargement validé" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NextCourse;
