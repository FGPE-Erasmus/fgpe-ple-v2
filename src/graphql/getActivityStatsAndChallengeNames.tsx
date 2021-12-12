import { gql } from "@apollo/client";

export const GET_ACTIVITY_STATS_AND_CHALLENGE_NAMES = gql`
  query activityStatsAndChallengeNamesQuery(
    $gameId: String!
    $groupId: String
  ) {
    game(id: $gameId) {
      id

      challenges {
        name
        refs {
          name
          id
        }
      }
    }

    stats(gameId: $gameId, groupId: $groupId) {
      nrOfSubmissions
      nrOfValidations
      nrOfSubmissionsByActivity
      nrOfValidationsByActivity
      nrOfSubmissionsByActivityAndResult
      nrOfValidationsByActivityAndResult
    }
  }
`;
