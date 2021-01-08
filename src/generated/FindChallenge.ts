/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Difficulty, Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: FindChallenge
// ====================================================

export interface FindChallenge_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  mode: Mode;
  modeParameters: string[];
  locked: boolean;
  hidden: boolean;
  refs: string[];
}

export interface FindChallenge {
  challenges: FindChallenge_challenges[];
}

export interface FindChallengeVariables {
  gameId: string;
}
