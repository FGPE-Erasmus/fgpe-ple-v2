import { gql } from "@apollo/client";

export const CHANGE_GAME_END_DATE = gql`
  mutation changeGameEndDateMutation($endDate: Date!, $gameId: String!) {
    changeEndDate(gameId: $gameId, endDate: $endDate) {
      id
    }
  }
`;
