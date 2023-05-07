import { getTeacherGamesQuery_myGames } from "../../generated/getTeacherGamesQuery";
import {
  getTeacherStudentsDetails_myGames,
  getTeacherStudentsDetails_myGames_players_group,
  getTeacherStudentsDetails_myGames_players_learningPath,
  getTeacherStudentsDetails_myGames_players_stats,
  getTeacherStudentsDetails_myGames_players_user,
} from "../../generated/getTeacherStudentsDetails";
import { GameStateEnum } from "../../generated/globalTypes";

export const teacherProfileTutorialData: getTeacherGamesQuery_myGames[] = [
  {
    __typename: "Game",
    id: "tutorial-1",
    name: "JavaScript challenge",
    description: "JavaScript challenge description",
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
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "tutorial-2",
    name: "JavaScript masterclass",
    description: "Master JS techniques and advanced concepts",
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
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "tutorial-3",
    name: "JavaScript Fundamentals",
    description: "Learn JS fundamentals",
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
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "tutorial-4",
    name: "The Legend of JS",
    description: "Embark on a legendary journey through JS mastery.",
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
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
      {
        __typename: "Player",
        id: "1",
      },
    ],
  },
  {
    __typename: "Game",
    id: "tutorial-4",
    name: "Amazing Game",
    description: "Immersive and captivating",
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

export const teacherProfileStudentsData: {
  game: getTeacherStudentsDetails_myGames;
  __typename: "Player";
  stats: getTeacherStudentsDetails_myGames_players_stats;
  group: getTeacherStudentsDetails_myGames_players_group | null;
  user: getTeacherStudentsDetails_myGames_players_user;
  learningPath: getTeacherStudentsDetails_myGames_players_learningPath[];
}[] = [
  {
    game: {
      __typename: "Game",
      id: "1",
      name: "JavaScript challenge",
      players: [],
    },

    __typename: "Player",
    stats: {
      __typename: "PlayerStats",
      nrOfSubmissions: 10,
      nrOfValidations: 43,
    },
    group: null,
    user: {
      __typename: "User",
      id: "1",
      lastName: "Doe",
      firstName: "John",
    },
    learningPath: [],
  },
  {
    game: {
      __typename: "Game",
      id: "1",
      name: "JavaScript challenge",
      players: [],
    },

    __typename: "Player",
    stats: {
      __typename: "PlayerStats",
      nrOfSubmissions: 343,
      nrOfValidations: 432,
    },
    group: null,
    user: {
      __typename: "User",
      id: "1",
      lastName: "Smith",
      firstName: "Bob",
    },
    learningPath: [],
  },
  {
    game: {
      __typename: "Game",
      id: "1",
      name: "Python masterclass",
      players: [],
    },

    __typename: "Player",
    stats: {
      __typename: "PlayerStats",
      nrOfSubmissions: 4,
      nrOfValidations: 23,
    },
    group: null,
    user: {
      __typename: "User",
      id: "1",
      lastName: "Smith",
      firstName: "Bob",
    },
    learningPath: [],
  },
  {
    game: {
      __typename: "Game",
      id: "1",
      name: "Python masterclass",
      players: [],
    },

    __typename: "Player",
    stats: {
      __typename: "PlayerStats",
      nrOfSubmissions: 32,
      nrOfValidations: 44,
    },
    group: null,
    user: {
      __typename: "User",
      id: "1",
      lastName: "Jan",
      firstName: "Kowalski",
    },
    learningPath: [],
  },
];
