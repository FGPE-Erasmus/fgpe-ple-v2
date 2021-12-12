/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: activityStatsAndChallengeNamesQuery
// ====================================================

export interface activityStatsAndChallengeNamesQuery_game_challenges_refs {
  __typename: "Activity";
  name: string | null;
  id: string | null;
}

export interface activityStatsAndChallengeNamesQuery_game_challenges {
  __typename: "Challenge";
  name: string;
  refs: activityStatsAndChallengeNamesQuery_game_challenges_refs[];
}

export interface activityStatsAndChallengeNamesQuery_game {
  __typename: "Game";
  id: string;
  challenges: activityStatsAndChallengeNamesQuery_game_challenges[];
}

export interface activityStatsAndChallengeNamesQuery_stats {
  __typename: "Stats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface activityStatsAndChallengeNamesQuery {
  game: activityStatsAndChallengeNamesQuery_game;
  stats: activityStatsAndChallengeNamesQuery_stats;
}

export interface activityStatsAndChallengeNamesQueryVariables {
  gameId: string;
  groupId?: string | null;
}
