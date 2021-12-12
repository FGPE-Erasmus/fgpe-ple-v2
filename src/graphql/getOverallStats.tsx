import { gql } from "@apollo/client";

export const GET_OVERALL_STATS = gql`
  query getOverallStats($gameId: String!, $groupId: String) {
    stats(gameId: $gameId, groupId: $groupId) {
      nrOfSubmissions
      nrOfValidations
    }
  }
`;
