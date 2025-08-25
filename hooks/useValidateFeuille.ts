import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ValidateEmargementPayload, validateFeuilleEmargement } from "@/api";
import { QUERY_KEY } from "@/lib/queries";

export const useValidateFeuille = () => {
  const queryClient = useQueryClient();

  const {
    mutate: validateFeuille,
    isError,
    data,
  } = useMutation({
    mutationFn: (payload: ValidateEmargementPayload) => {
      return validateFeuilleEmargement(payload);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.EMARGEMENT_NON_FAIT],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GROUP_STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAST_PRESENCE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.NEXT_COURSE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ATTENDANCE_LIST] });
    },
  });

  return { validateFeuille, isError, data };
};
