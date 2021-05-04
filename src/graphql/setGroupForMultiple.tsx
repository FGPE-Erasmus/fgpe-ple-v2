import { gql } from "@apollo/client";

export const SET_GROUP_FOR_MULTIPLE = gql`
  mutation setGroupForMultipleMutation(
    $gameId: String!
    $groupId: String!
    $playersIds: [String!]!
  ) {
    setGroupForMultiple(
      gameId: $gameId
      groupId: $groupId
      playersIds: $playersIds
    ) {
      id
    }
  }
`;
