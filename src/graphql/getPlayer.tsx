import { gql } from "@apollo/client";

export const GET_PLAYER = gql`
  query getPlayerQuery($gameId: String!, $userId: String!) {
    player(gameId: $gameId, userId: $userId) {
      id

      game {
        id
        name
        groups {
          id
          name
          displayName
        }

        challenges {
          id
          refs {
            id
            name
            title
          }
        }
      }

      user {
        id
        username
        email
        firstName
        lastName
      }

      group {
        id
        name
      }

      points

      rewards {
        id
        reward {
          id
          kind
          name
          description
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
        submittedAt
        exerciseId
        feedback
        language
        metrics
        program
        result
      }

      validations {
        id
        submittedAt
        exerciseId
        feedback
        language
        metrics
        program
        result
        outputs
      }
    }
  }
`;
