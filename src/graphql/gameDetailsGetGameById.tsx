import { gql } from "@apollo/client";

export const GAME_DETAILS_GET_GAME_BY_ID = gql`
  query gameDetailsGetGameByIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      startDate
      endDate

      archival
      private

      players {
        id
        stats {
          nrOfSubmissions
          nrOfValidations
          nrOfSubmissionsByActivity
          nrOfValidationsByActivity
          nrOfSubmissionsByActivityAndResult
          nrOfValidationsByActivityAndResult
        }
      }
      createdAt
    }
  }
`;
