import { gql } from "@apollo/client";

export const GET_STUDENTS_DETAILS_BY_GAME_ID = gql`
  query getStudentsDetailsByGameIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      groups {
        id
        name
        displayName
      }
      challenges {
        name
        refs {
          name
          id
        }
      }
      players {
        group {
          name
        }
        id
        stats {
          nrOfSubmissions
          nrOfValidations
          nrOfSubmissionsByActivity
          nrOfValidationsByActivity
          nrOfSubmissionsByActivityAndResult
          nrOfValidationsByActivityAndResult
        }
        user {
          id
          firstName
          lastName
        }
        learningPath {
          progress
        }
      }
      createdAt
    }
  }
`;
