import {
  gameDetailsGetGameByIdQuery,
  gameDetailsGetGameByIdQuery_game_submissions,
} from "../../generated/gameDetailsGetGameByIdQuery";
import { getOverallStats } from "../../generated/getOverallStats";

const submissions: gameDetailsGetGameByIdQuery_game_submissions[] = [
  {
    __typename: "Submission",
    submittedAt: "2023-03-01T12:00:00.000Z",
  },
  {
    __typename: "Submission",
    submittedAt: "2023-04-12T12:00:00.000Z",
  },
  {
    __typename: "Submission",
    submittedAt: "2023-05-05T12:00:00.000Z",
  },
  {
    __typename: "Submission",
    submittedAt: "2023-02-12T12:00:00.000Z",
  },
  {
    __typename: "Submission",
    submittedAt: "2023-04-22T12:00:00.000Z",
  },
  {
    __typename: "Submission",
    submittedAt: "2023-03-13T12:00:00.000Z",
  },
];

export const teacherGameTutorialData: Omit<
  gameDetailsGetGameByIdQuery["game"],
  "name"
> = {
  submissions: submissions,
  createdAt: "2021-10-01T12:00:00.000Z",
  __typename: "Game",
  id: "tutorial-1",
  //   name: "JavaScript challenge",
  //   description: "JavaScript challenge description",
  private: false,
  archival: false,
  startDate: null,
  endDate: null,
  //   state: GameStateEnum.OPEN,
  players: [
    {
      __typename: "Player",
      id: "1",
      stats: {
        __typename: "PlayerStats",
        nrOfSubmissionsByActivity: [],
        nrOfValidationsByActivity: [],
        nrOfSubmissionsByActivityAndResult: [],
        nrOfValidationsByActivityAndResult: [],
        nrOfSubmissions: 12,
        nrOfValidations: 13,
      },
    },
    {
      __typename: "Player",
      id: "1",
      stats: {
        __typename: "PlayerStats",
        nrOfSubmissionsByActivity: [],
        nrOfValidationsByActivity: [],
        nrOfSubmissionsByActivityAndResult: [],
        nrOfValidationsByActivityAndResult: [],
        nrOfSubmissions: 12,
        nrOfValidations: 13,
      },
    },
    {
      __typename: "Player",
      id: "1",
      stats: {
        __typename: "PlayerStats",
        nrOfSubmissionsByActivity: [],
        nrOfValidationsByActivity: [],
        nrOfSubmissionsByActivityAndResult: [],
        nrOfValidationsByActivityAndResult: [],
        nrOfSubmissions: 12,
        nrOfValidations: 13,
      },
    },
    {
      __typename: "Player",
      id: "1",
      stats: {
        __typename: "PlayerStats",
        nrOfSubmissionsByActivity: [],
        nrOfValidationsByActivity: [],
        nrOfSubmissionsByActivityAndResult: [],
        nrOfValidationsByActivityAndResult: [],
        nrOfSubmissions: 12,
        nrOfValidations: 13,
      },
    },
  ],
};

export const teacherOveralStatsTutorialData: getOverallStats = {
  stats: {
    nrOfSubmissions: 33,
    nrOfValidations: 17,
    __typename: "Stats",
  },
};
