import { gql } from "@apollo/client";

export const GET_TEACHER_GAMES = gql`
  query getTeacherGamesQuery {
    myGames {
      id
      name
      description
      private
      startDate
      endDate
      state
      players {
        id
      }
    }
  }
`;
