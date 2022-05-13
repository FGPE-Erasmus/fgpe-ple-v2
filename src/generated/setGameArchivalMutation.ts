/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setGameArchivalMutation
// ====================================================

export interface setGameArchivalMutation_setArchival {
  __typename: "Game";
  id: string;
}

export interface setGameArchivalMutation {
  setArchival: setGameArchivalMutation_setArchival;
}

export interface setGameArchivalMutationVariables {
  gameId: string;
  isArchival: boolean;
}
