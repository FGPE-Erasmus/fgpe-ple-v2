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
}

export interface getOverallStats {
  stats: getOverallStats_stats;
}

export interface getOverallStatsVariables {
  gameId: string;
  groupId?: string | null;
}
