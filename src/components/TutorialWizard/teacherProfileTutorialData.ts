import { getTeacherGamesQuery_myGames } from "../../generated/getTeacherGamesQuery";
import { GameStateEnum } from "../../generated/globalTypes";

export const teacherProfileTutorialData: getTeacherGamesQuery_myGames[] = [
  {
    __typename: "Game",
    id: "1",
    name: "Game 1",
    description: "Game 1 description",
    private: false,
    archival: false,
    startDate: null,
    endDate: null,
    state: GameStateEnum.OPEN,
    players: [
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "2",
    name: "Game 2",
    description: "Game 2 description",
    private: false,
    archival: false,
    startDate: null,
    endDate: null,
    state: GameStateEnum.OPEN,
    players: [
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "3",
    name: "Game 3",
    description: "Game 3 description",
    private: false,
    archival: false,
    startDate: null,
    endDate: null,
    state: GameStateEnum.OPEN,
    players: [
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "4",
    name: "Game 4",
    description: "Game 4 description",
    private: false,
    archival: false,
    startDate: null,
    endDate: null,
    state: GameStateEnum.OPEN,
    players: [
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "4",
    name: "Amazing Game",
    description: "An amazing game description",
    private: true,
    archival: false,
    startDate: null,
    endDate: null,
    state: GameStateEnum.OPEN,
    players: [
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "2",
      },
      {
        __typename: "Player",
        id: "3",
      },
    ],
  },
];
