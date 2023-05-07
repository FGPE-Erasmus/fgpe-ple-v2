/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTeacherStudentsDetailsSmall
// ====================================================

export interface getTeacherStudentsDetailsSmall_myGames_players_group {
  __typename: "Group";
  name: string;
}

export interface getTeacherStudentsDetailsSmall_myGames_players_user {
  __typename: "User";
  id: string | null;
  lastName: string | null;
  firstName: string | null;
}

export interface getTeacherStudentsDetailsSmall_myGames_players {
  __typename: "Player";
  group: getTeacherStudentsDetailsSmall_myGames_players_group | null;
  user: getTeacherStudentsDetailsSmall_myGames_players_user;
}

export interface getTeacherStudentsDetailsSmall_myGames {
  __typename: "Game";
  id: string;
  name: string;
  players: getTeacherStudentsDetailsSmall_myGames_players[];
}

export interface getTeacherStudentsDetailsSmall {
  myGames: getTeacherStudentsDetailsSmall_myGames[];
}
