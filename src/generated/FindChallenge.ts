/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: FindChallenge
// ====================================================

export interface FindChallenge_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface FindChallenge_myChallengeStatus_challenge {
  __typename: "Challenge";
  mode: Mode;
}

export interface FindChallenge_myChallengeStatus_refs_activity_codeSkeletons {
  __typename: "CodeSkeleton";
  extension: string | null;
  code: string | null;
}

export interface FindChallenge_myChallengeStatus_refs_activity {
  __typename: "Activity";
  id: string | null;
  pdf: boolean | null;
  statement: string | null;
  editorKind: string | null;
  name: string | null;
  title: string | null;
  codeSkeletons: FindChallenge_myChallengeStatus_refs_activity_codeSkeletons[] | null;
}

export interface FindChallenge_myChallengeStatus_refs {
  __typename: "ActivityStatus";
  activity: FindChallenge_myChallengeStatus_refs_activity | null;
  solved: boolean | null;
}

export interface FindChallenge_myChallengeStatus {
  __typename: "ChallengeStatus";
  startedAt: any | null;
  endedAt: any | null;
  openedAt: any | null;
  challenge: FindChallenge_myChallengeStatus_challenge;
  refs: FindChallenge_myChallengeStatus_refs[];
}

export interface FindChallenge_programmingLanguages {
  __typename: "ProgrammingLanguage";
  id: string | null;
  name: string | null;
  extension: string | null;
}

export interface FindChallenge {
  game: FindChallenge_game;
  myChallengeStatus: FindChallenge_myChallengeStatus;
  programmingLanguages: FindChallenge_programmingLanguages[];
}

export interface FindChallengeVariables {
  gameId: string;
  challengeId: string;
}
