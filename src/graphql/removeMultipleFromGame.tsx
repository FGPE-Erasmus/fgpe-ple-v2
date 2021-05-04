import { gql } from "@apollo/client";

export const REMOVE_MULTIPLE_FROM_GAME = gql`
  mutation removeMultipleFromGameMutation(
    $gameId: String!
    $usersIds: [String!]!
  ) {
    removeMultipleFromGame(gameId: $gameId, usersIds: $usersIds) {
      id
    }
  }
`;
