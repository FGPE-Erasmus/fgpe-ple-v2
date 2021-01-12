/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Difficulty, Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: FindChallenge
// ====================================================

export interface FindChallenge_challenge_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
  statement: string | null;
}

export interface FindChallenge_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  mode: Mode;
  modeParameters: string[];
  locked: boolean;
  hidden: boolean;
  refs: FindChallenge_challenge_refs[];
}

export interface FindChallenge_programmingLanguages {
  __typename: "ProgrammingLanguage";
  id: string | null;
  name: string | null;
  extension: string | null;
}

export interface FindChallenge {
  challenge: FindChallenge_challenge;
  programmingLanguages: FindChallenge_programmingLanguages[];
}

export interface FindChallengeVariables {
  gameId: string;
  challengeId: string;
}
