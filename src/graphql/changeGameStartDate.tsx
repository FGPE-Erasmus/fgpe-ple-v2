import { gql } from "@apollo/client";

export const CHANGE_GAME_START_DATE = gql`
  mutation changeGameStartDateMutation($startDate: Date!, $gameId: String!) {
    changeStartDate(gameId: $gameId, startDate: $startDate) {
      id
    }
  }
`;
