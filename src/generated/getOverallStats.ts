/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOverallStats
// ====================================================

export interface getOverallStats_stats {
  __typename: "Stats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getOverallStats {
  stats: getOverallStats_stats;
}

export interface getOverallStatsVariables {
  gameId: string;
  groupId?: string | null;
}
