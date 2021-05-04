import { gql } from "@apollo/client";

export const AUTO_ASSIGN_GROUPS = gql`
mutation autoAssignGroupsMutation($gameId: String!) {
  autoAssignGroups(gameId: $gameId) {
    id
  }
}
`;