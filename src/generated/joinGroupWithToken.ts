/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: joinGroupWithToken
// ====================================================

export interface joinGroupWithToken_addToGroupWithToken_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface joinGroupWithToken_addToGroupWithToken_user {
  __typename: "User";
  username: string | null;
}

export interface joinGroupWithToken_addToGroupWithToken_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface joinGroupWithToken_addToGroupWithToken {
  __typename: "Player";
  id: string;
  game: joinGroupWithToken_addToGroupWithToken_game;
  user: joinGroupWithToken_addToGroupWithToken_user;
  group: joinGroupWithToken_addToGroupWithToken_group | null;
}

export interface joinGroupWithToken {
  addToGroupWithToken: joinGroupWithToken_addToGroupWithToken;
}

export interface joinGroupWithTokenVariables {
  gameId: string;
  token: string;
}
