import { ApolloError } from "@apollo/client";

export enum SERVER_ERRORS {
  ECONNABORTED = "ECONNABORTED",
}

export const checkIfConnectionAborted = (error: ApolloError) => {
  if(!error) {
    return false
  }

  if(!error.graphQLErrors[0]) {
    return false;
  }

  if(!error.graphQLErrors[0].message) {
    return false
  }

  if(error.graphQLErrors[0].message.includes(
    SERVER_ERRORS.ECONNABORTED
  )) {
    return true
  }


  return false;
}