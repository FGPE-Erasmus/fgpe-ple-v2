/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getActivityById
// ====================================================

export interface getActivityById_activity_codeSkeletons {
  __typename: "CodeSkeleton";
  extension: string | null;
  code: string | null;
}

export interface getActivityById_activity {
  __typename: "Activity";
  id: string | null;
  pdf: boolean | null;
  statement: string | null;
  editorKind: string | null;
  name: string | null;
  title: string | null;
  codeSkeletons: getActivityById_activity_codeSkeletons[] | null;
}

export interface getActivityById {
  activity: getActivityById_activity;
}

export interface getActivityByIdVariables {
  gameId: string;
  activityId: string;
}
