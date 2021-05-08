import { gql } from "@apollo/client";

export const REMOVE_MULTIPLE_FROM_GROUP = gql`
  mutation removeMultipleFromGroupMutation(
    $gameId: String!
    $playersIds: [String!]!
  ) {
    removeMultipleFromGroup(gameId: $gameId, playersIds: $playersIds) {
      id
    }
  }
`;
