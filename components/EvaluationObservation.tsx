import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "./Button";
import {
  postNextLevelStatus,
  NextLevelStatusPayload,
  NextLevelStatusResponse,
} from "@/api/index";
import { QUERY_KEY } from "@/lib/queries";

type StandardNextLevelType = "NA" | "Admis" | "Non admis";

interface ValiderEmargementModalProps {
  onCancel: () => void;
  initialAppreciation?: string;
  groupId: number;
  nextLevel: StandardNextLevelType;
  studentId: number;
}
const EvaluationObservation = ({
  onCancel,
  initialAppreciation = "",
  groupId,
  nextLevel,
  studentId,
}: ValiderEmargementModalProps) => {
  const [appreciation, setAppreciation] = useState<string>(
    initialAppreciation === "NA" ? "" : initialAppreciation ?? ""
  );

  const queryClient = useQueryClient();

  const retour = () => {
    setTimeout(() => {
      onCancel();
    }, 100);
  };

  const { mutate } = useMutation<
    NextLevelStatusResponse,
    Error,
    NextLevelStatusPayload
  >({
    mutationFn: (payload: NextLevelStatusPayload) =>
      postNextLevelStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
      onCancel();
    },
  });

  const handleValidate = () => {
    const payload: NextLevelStatusPayload = {
      group_id: groupId,
      next_level: nextLevel,
      student_id: studentId,
      appreciation,
    };
    mutate(payload);
  };
  
  return (
    <div className="relative p-2 flex flex-col items-center">
      <h3 className="text-md font-semibold text-black my-2 self-start">
        Ajouter une observation ...
      </h3>
      <textarea
        className="form-textarea mt-1 block w-full rounded-lg border border-gray-300 shadow-md px-4 py-4"
        rows={6}
        value={appreciation}
        onChange={(e) => setAppreciation(e.target.value)}
      />
      <div className="flex justify-center gap-6 w-full mt-4">
        <Button
          className="bg-shatibi-red/[.15] text-shatibi-red font-bold py-2 px-8 rounded-full"
          onClick={retour}
          variant="red"
        >
          Retour
        </Button>

        <Button
          className="text-shatibi-green bg-shatibi-green/[.15] font-bold py-2 px-8 rounded-full"
          onClick={handleValidate}
          variant="green"
        >
          Confirmer
        </Button>
      </div>
    </div>
  );
};

export default EvaluationObservation;
