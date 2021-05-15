import { gql } from "@apollo/client";

export const SET_GAME_AVAILABILITY = gql`
  mutation setGameAvailabilityMutation($gameId: String!, $isPrivate: Boolean!) {
    setAvailability(gameId: $gameId, isPrivate: $isPrivate) {
      id
    }
  }
`;
