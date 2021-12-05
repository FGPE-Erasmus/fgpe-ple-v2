/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum, State } from "./globalTypes";

// ====================================================
// GraphQL query operation: ProfileInGameQuery
// ====================================================

export interface ProfileInGameQuery_profileInGame_game {
  __typename: "Game";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  state: GameStateEnum;
}

export interface ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
  parentChallenge: ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath {
  __typename: "ChallengeStatus";
  id: string;
  challenge: ProfileInGameQuery_profileInGame_learningPath_challenge;
  state: State;
  progress: number;
  startedAt: any | null;
  openedAt: any | null;
  endedAt: any | null;
}

export interface ProfileInGameQuery_profileInGame {
  __typename: "Player";
  id: string;
  game: ProfileInGameQuery_profileInGame_game;
  learningPath: ProfileInGameQuery_profileInGame_learningPath[];
}

export interface ProfileInGameQuery {
  profileInGame: ProfileInGameQuery_profileInGame;
}

export interface ProfileInGameQueryVariables {
  gameId: string;
}
