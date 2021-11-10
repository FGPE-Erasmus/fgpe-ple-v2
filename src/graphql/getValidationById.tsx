import { gql } from "@apollo/client";

export const GET_VALIDATION_BY_ID = gql`
  query getValidationByIdQuery($gameId: String!, $validationId: String!) {
    validation(gameId: $gameId, id: $validationId) {
      id
      outputs
      feedback
      program
    }
  }
`;
