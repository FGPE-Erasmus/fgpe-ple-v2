import { gql } from "@apollo/client";

export const GAME_DETAILS_GET_GAME_BY_ID = gql`
  query gameDetailsGetGameByIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      startDate
      endDate
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
      createdAt
    }
  }
`;
