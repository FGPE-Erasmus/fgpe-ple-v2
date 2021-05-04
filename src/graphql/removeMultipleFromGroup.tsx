import { gql } from "@apollo/client";

export const REMOVE_MULTIPLE_FROM_GROUP = gql`
mutation removeMultipleFromGroupMutation(
    $gameId: String!
    $groupId: String!
    $playersIds: [String!]!
  ) {
    removeMultipleFromGroup(
      gameId: $gameId
      groupId: $groupId
      playersIds: $playersIds
    ) {
      id
    }
  }
`;