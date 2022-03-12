import { gql } from "@apollo/client";

export const FIND_CHALLENGE = gql`
  query FindChallenge($gameId: String!, $challengeId: String!) {
    game(id: $gameId) {
      id
      name
    }

    myChallengeStatus(gameId: $gameId, challengeId: $challengeId) {
      startedAt
      endedAt
      openedAt

      challenge {
        id
        name
        mode
      }

      refs {
        activity {
          id
          name
          title
        }
        solved
      }
    }

    programmingLanguages(gameId: $gameId) {
      id
      name
      extension
    }
  }
`;
