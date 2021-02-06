import { Result } from "../../../generated/globalTypes";

export const getColorSchemeForSubmissionResult = (submissionResult: string) => {
  if (submissionResult == Result.ACCEPT) {
    return "green";
  }
  if (submissionResult == Result.ASK_FOR_REEVALUATION) {
    return "orange";
  }

  return "red";
};
