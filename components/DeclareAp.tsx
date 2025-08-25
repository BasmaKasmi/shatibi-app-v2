import Image from "next/image";
import User from "@/public/search-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@mantine/core";
import StudentGroups from "./StudentGroups";
import { formatDayToThreeLetters, sortGroupsByDayAndTime } from "@/lib/dates";
import {
  Group,
  Student,
  getGroups,
  searchStudentByName,
  getStudentGroups,
} from "@/api";
import { QUERY_KEY } from "@/lib/queries";
import { useTeacher } from "@/app/TeacherContext";
import { StudentDates } from "./StudentDates";
import ConfirmAp from "./ConfirmAp";
import { useList } from "react-use";

interface StudentInfoFromSearch {
  student_id: number;
  lastname: string;
  firstname: string;
}

const DeclareAp = () => {
  const [studentName, setStudentName] = useState("");
  const [isStudentGroupsModalOpen, setIsStudentGroupsModalOpen] =
    useState(false);
  const [selectedStudentForGroups, setSelectedStudentForGroups] =
    useState<StudentInfoFromSearch | null>(null);
  const [showStudentDatesModal, setShowStudentDatesModal] = useState(false);
  const [showConfirmApModal, setShowConfirmApModal] = useState(false);
  const [selectedStudentGroup, setSelectedStudentGroup] = useState<any | null>(
    null
  );
  const [selectedDates, selectedDatesFunctions] = useList<string>([]);
  const [modalToDisplay, setModalToDisplay] = useState<
    "students_groups" | "declare_ap" | "confirm_ap" | null
  >(null);
  const { teacherId, setTeacherId } = useTeacher();

  const router = useRouter();

  const handleNameChange = (event: any) => {
    setStudentName(event.target.value);
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

  const { data: studentsSearchResult, isLoading: isStudentLoading } = useQuery<
    StudentInfoFromSearch[]
  >({
    queryKey: [QUERY_KEY.SEARCH_STUDENT, studentName, teacherId],
    queryFn: () => {
      if (!teacherId) {
        throw new Error("Teacher ID is required to search for students");
      }
      return searchStudentByName(studentName, teacherId);
    },
    enabled: !!studentName && !!teacherId,
  });

  if (isLoading) return <div>Chargement...</div>;

  if (isError) return <div>Erreur: {error.message}</div>;

  const showStudentSearchResults =
    studentName.length > 0 &&
    (isStudentLoading ||
      (studentsSearchResult && studentsSearchResult.length > 0));

  const handleStudentClick = async (student: StudentInfoFromSearch) => {
    setSelectedStudentForGroups({
      student_id: student.student_id,
      firstname: student.firstname,
      lastname: student.lastname,
    });

    try {
      const studentGroupsResponse = await getStudentGroups(
        student.student_id,
        teacherId!
      );

      if (studentGroupsResponse && studentGroupsResponse.result.group_list) {
        const studentGroups = studentGroupsResponse.result.group_list;

        if (studentGroups.length === 1) {
          setSelectedStudentGroup({
            group_id: studentGroups[0].id,
            student_id: student.student_id,
            firstname: student.firstname,
            lastname: student.lastname,
          });

          setModalToDisplay("declare_ap");
          setIsStudentGroupsModalOpen(true);
        } else {
          setIsStudentGroupsModalOpen(true);
          setModalToDisplay(null);
        }
      } else {
        setIsStudentGroupsModalOpen(true);
        setModalToDisplay(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des groupes de l'étudiant:",
        error
      );
      setIsStudentGroupsModalOpen(true);
      setModalToDisplay(null);
    }
  };

  const handleCancel = () => {
    setIsStudentGroupsModalOpen(false);
    setShowStudentDatesModal(false);
    setShowConfirmApModal(false);
    setModalToDisplay(null);
    setSelectedStudentGroup(null);
    selectedDatesFunctions.reset();
  };

  const handleValidateDates = () => {
    setShowConfirmApModal(true);
    setShowStudentDatesModal(false);
    setModalToDisplay("confirm_ap");
  };

  const handleBackToStudentDates = () => {
    setShowConfirmApModal(false);
    setShowStudentDatesModal(true);
    setModalToDisplay("declare_ap");
  };

  const handleConfirmAp = () => {
    handleCancel();
  };

  const sortedGroups = groups ? sortGroupsByDayAndTime(groups) : [];

  return (
    <div className="relative p-2 justify-items-center flex flex-col items-center">
      {isStudentGroupsModalOpen ? (
        <style>
          {/* This enables us to hide the Mantine modal which is behind on which we put the id="declare-ap" */}

          {`
            /* Mantine modal body id */

            #declare-ap-body {
              display: none;
            }
          `}
        </style>
      ) : null}

      <h3 className="text-center text-lg font-semibold text-black mb-8">
        Déclarer une absence
      </h3>

      <div className="mb-4 bg-white rounded-xl shadow w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 h-24 mx-auto">
        <div className="flex gap-2 pl-4 place-items-center">
          <Image className="mt-2" src={User} alt="User" />

          <label
            htmlFor="searchStudentByName"
            className="block text-sm font-semibold mt-2"
          >
            Rechercher par nom :
          </label>
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            id="searchByName"
            className="w-10/12 p-3 border rounded-full mt-2 text-xs h-10"
            placeholder=""
            value={studentName}
            onChange={handleNameChange}
          />
        </div>
      </div>

      {showStudentSearchResults ? (
        <div className="mb-4 bg-white rounded-xl shadow w-full h-64 lg:h-80 xl:h-96 max-h-[63%] overflow-y-scroll">
          <div className="flex flex-col items-center justify-center space-y-2">
            {studentsSearchResult && studentsSearchResult.length > 0 ? (
              <div className="w-full px-4 py-2">
                {studentsSearchResult.map((student) => (
                  <div
                    key={student.student_id}
                    className="bg-white px-4 py-2 rounded-lg shadow-md mt-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <p className="font-semibold text-sm truncate">{`${student.firstname} ${student.lastname}`}</p>
                  </div>
                ))}
              </div>
            ) : (
              !isStudentLoading && (
                <div className="text-gray-500 py-2 text-center">
                  Aucun étudiant trouvé
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="mb-4 bg-white rounded-xl shadow w-full flex flex-col gap-y-2 h-64 sm:h-64 md:h-96 lg:h-80 xl:h-96">
          <div className="flex gap-2 pl-4 place-items-center text-sm font-semibold mt-4">
            <Image src={User} alt="User" />
            Rechercher par groupe :
          </div>

          <div className="flex flex-col items-center gap-1 grow overflow-y-scroll">
            {sortedGroups?.map((group) => (
              <div
                onClick={() =>
                  // @ts-ignore
                  router.push(
                    `liste-etudiants?groupId=${group.id}&groupName=${group.name}&groupSlot=${group.slot}`
                  )
                }
                key={group.id}
                className="px-4 py-2 bg-white shadow-md rounded-lg w-[95%] mb-2"
              >
                <p className="text-[14px] font-semibold">
                  {group.name || "Nom du cours indisponible"}
                </p>
                <p className="text-xs font-light">
                  {formatDayToThreeLetters(group.slot)}
                </p>
              </div>
            ))}
            {!groups ||
              (groups.length === 0 && <div>Pas de groupes à afficher</div>)}
          </div>
        </div>
      )}

      <Modal
        id="selected-student-groups"
        withCloseButton={false}
        radius="lg"
        centered
        opened={isStudentGroupsModalOpen && modalToDisplay === null}
        onClose={() => setIsStudentGroupsModalOpen(false)}
      >
        {selectedStudentForGroups && (
          <StudentGroups
            name={`${selectedStudentForGroups.firstname} ${selectedStudentForGroups.lastname}`}
            studentId={selectedStudentForGroups.student_id}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <Modal
        centered
        opened={
          isStudentGroupsModalOpen &&
          modalToDisplay === "declare_ap" &&
          selectedStudentGroup !== null
        }
        withCloseButton={false}
        radius="lg"
        onClose={handleCancel}
      >
        {selectedStudentGroup && (
          <StudentDates
            group_id={selectedStudentGroup.group_id}
            student_id={selectedStudentGroup.student_id}
            start_date=""
            end_date=""
            name={`${selectedStudentGroup.firstname} ${selectedStudentGroup.lastname}`}
            onClickCancel={handleCancel}
            onClickValidate={handleValidateDates}
            selectedDates={selectedDates}
            selectedDatesFunctions={selectedDatesFunctions}
          />
        )}
      </Modal>

      <Modal
        centered
        opened={
          isStudentGroupsModalOpen &&
          modalToDisplay === "confirm_ap" &&
          selectedStudentGroup !== null
        }
        withCloseButton={false}
        radius="lg"
        onClose={handleCancel}
      >
        {selectedStudentGroup && (
          <ConfirmAp
            student={{
              student_id: selectedStudentGroup.student_id,
              firstname: selectedStudentGroup.firstname,
              lastname: selectedStudentGroup.lastname,
            }}
            onClickCancel={handleBackToStudentDates}
            onClickValidate={handleConfirmAp}
            selectedDates={selectedDates}
            groupId={selectedStudentGroup.group_id}
          />
        )}
      </Modal>
    </div>
  );
};

export default DeclareAp;
