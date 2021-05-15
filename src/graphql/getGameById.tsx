import { gql } from "@apollo/client";

export const GET_GAME_BY_ID = gql`
  query getGameByIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      description
      gedilLayerId
      gedilLayerDescription
      courseId
      startDate
      endDate
      state
      evaluationEngine
      private
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
      }
      instructors {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;
