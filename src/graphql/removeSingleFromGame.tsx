import { gql } from "@apollo/client";

export const REMOVE_SINGLE_FROM_GAME = gql`
  mutation removeSingleFromGameMutation($gameId: String!, $userId: String!) {
    removeFromGame(gameId: $gameId, userId: $userId) {
      id
    }
  }
`;
