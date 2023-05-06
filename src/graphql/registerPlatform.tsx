import { gql } from "@apollo/client";

export const REGISTER_PLATFORM = gql`
  mutation ($name: String!, $clientId: String!, $url: String!) {
    registerPlatform(name: $name, clientId: $clientId, url: $url) {
      publicKey
    }
  }
`;
