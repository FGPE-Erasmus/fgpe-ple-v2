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

export interface FindChallenge_profileInGame_learningPath_refs_activity {
  __typename: "Activity";
  id: string | null;
}

export interface FindChallenge_profileInGame_learningPath_refs {
  __typename: "ActivityStatus";
  activity: FindChallenge_profileInGame_learningPath_refs_activity | null;
  solved: boolean | null;
}

export interface FindChallenge_profileInGame_learningPath {
  __typename: "ChallengeStatus";
  refs: FindChallenge_profileInGame_learningPath_refs[];
}

export interface FindChallenge_profileInGame {
  __typename: "Player";
  learningPath: FindChallenge_profileInGame_learningPath[];
}

export interface FindChallenge_programmingLanguages {
  __typename: "ProgrammingLanguage";
  id: string | null;
  name: string | null;
  extension: string | null;
}

export interface FindChallenge {
  challenge: FindChallenge_challenge;
  profileInGame: FindChallenge_profileInGame;
  programmingLanguages: FindChallenge_programmingLanguages[];
}

export interface FindChallengeVariables {
  gameId: string;
  challengeId: string;
}
