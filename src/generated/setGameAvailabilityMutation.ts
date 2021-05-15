/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setGameAvailabilityMutation
// ====================================================

export interface setGameAvailabilityMutation_setAvailability {
  __typename: "Game";
  id: string;
}

export interface setGameAvailabilityMutation {
  setAvailability: setGameAvailabilityMutation_setAvailability;
}

export interface setGameAvailabilityMutationVariables {
  gameId: string;
  isPrivate: boolean;
}
