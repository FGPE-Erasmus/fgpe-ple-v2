/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: getTeacherGamesQuery
// ====================================================

export interface getTeacherGamesQuery_myGames_players {
  __typename: "Player";
  id: string;
}

export interface getTeacherGamesQuery_myGames {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  private: boolean;
  startDate: any | null;
  endDate: any | null;
  state: GameStateEnum;
  players: getTeacherGamesQuery_myGames_players[];
}

export interface getTeacherGamesQuery {
  myGames: getTeacherGamesQuery_myGames[];
}
