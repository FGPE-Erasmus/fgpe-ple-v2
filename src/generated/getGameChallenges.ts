/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGameChallenges
// ====================================================

export interface getGameChallenges_challenges_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
}

export interface getGameChallenges_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  hidden: boolean;
  refs: getGameChallenges_challenges_refs[];
}

export interface getGameChallenges {
  challenges: getGameChallenges_challenges[];
}

export interface getGameChallengesVariables {
  gameId: string;
}
