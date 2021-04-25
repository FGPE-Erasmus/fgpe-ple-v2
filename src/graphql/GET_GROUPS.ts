import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
query getGroupsQuery($gameId: String!) {
  groups(gameId: $gameId) {
    id
    name
    displayName
  }
}
`;