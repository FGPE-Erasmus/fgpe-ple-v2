/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProgrammingLanguage
// ====================================================

export interface ProgrammingLanguage_programmingLanguages {
  __typename: "ProgrammingLanguage";
  id: string | null;
  name: string | null;
  extension: string | null;
}

export interface ProgrammingLanguage {
  programmingLanguages: ProgrammingLanguage_programmingLanguages[];
}

export interface ProgrammingLanguageVariables {
  gameId: string;
}
