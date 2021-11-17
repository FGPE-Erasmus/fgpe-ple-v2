import { gql } from "@apollo/client";

export const GET_ALL_GAME_PROFILES = gql`
  query allGameProfilesQuery($userId: String!) {
    allGameProfiles(userId: $userId) {
      id

      game {
        id
        name
      }

      group {
        id
        name
      }

      points
      rewards {
        id
        reward {
          name
        }
      }

      stats {
        nrOfSubmissions
        nrOfValidations
      }
    }
  }
`;
