import { gql } from "@apollo/client";

export const GET_ALL_GAME_PROFILES = gql`
  query allGameProfilesQuery($userId: String!) {
    allGameProfiles(userId: $userId) {
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
          description
          createdAt
        }
      }

      stats {
        nrOfSubmissions
        nrOfValidations
        nrOfSubmissionsByActivity
        nrOfValidationsByActivity
        nrOfSubmissionsByActivityAndResult
        nrOfValidationsByActivityAndResult
      }

      submissions {
        id
      }

      validations {
        id
      }

      user {
        email
        emailVerified
        firstName
        lastName
        username
      }

      learningPath {
        progress
      }
    }
  }
`;
