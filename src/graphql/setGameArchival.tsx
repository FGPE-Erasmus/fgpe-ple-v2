import { gql } from "@apollo/client";

export const SET_GAME_ARCHIVAL = gql`
  mutation setGameArchivalMutation($gameId: String!, $isArchival: Boolean!) {
    setArchival(gameId: $gameId, isArchival: $isArchival) {
      id
    }
  }
`;
