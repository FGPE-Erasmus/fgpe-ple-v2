import { getPlayerQuery } from "../../../../generated/getPlayerQuery";

const mockPlayerData: getPlayerQuery = {
  player: {
    id: "6278d437384d748850cb3e34",
    learningPath: [
      {
        challenge: {
          id: "60e8ad92c88f755e5472d212",
          name: "Basic Programming  ",
          refs: [
            {
              id: "32897c1a-da97-40c2-a9f5-8305fc310750",
              name: "Oddish or Evenish",
              __typename: "Activity",
            },
            {
              id: "3e766a76-bd5e-480b-800f-31d1611b1e73",
              name: "Find Min-Max",
              __typename: "Activity",
            },
            {
              id: "ac123f69-a27e-433c-9455-480cf3f5c31d",
              name: "Add up the numbers",
              __typename: "Activity",
            },
          ],
          __typename: "Challenge",
        },
        progress: 1,
        __typename: "ChallengeStatus",
      },
      {
        challenge: {
          id: "60e8ad92c88f75da3672d217",
          name: "Ultimate Test",
          refs: [
            {
              id: "db6a4f54-2aeb-4502-823a-92914aa8e60b",
              name: "Anonymous Functions: Adding Suffixes",
              __typename: "Activity",
            },
          ],
          __typename: "Challenge",
        },
        progress: 1,
        __typename: "ChallengeStatus",
      },
    ],
    game: {
      id: "60e8ad92c88f75305c72d211",
      name: "Hands-On JavaScript",
      groups: [],
      __typename: "Game",
    },
    user: {
      id: "39802822-eae2-40e4-9d18-4eb8502d285a",
      username: "robertgarcia",
      email: "test@example.com",
      firstName: "Robert",
      lastName: "Garcia",
      __typename: "User",
    },
    group: null,
    stats: {
      nrOfSubmissions: 12,
      nrOfValidations: 16,
      nrOfSubmissionsByActivity: {
        "ac123f69-a27e-433c-9455-480cf3f5c31d": 2,
        "3e766a76-bd5e-480b-800f-31d1611b1e73": 5,
        "32897c1a-da97-40c2-a9f5-8305fc310750": 4,
        "db6a4f54-2aeb-4502-823a-92914aa8e60b": 1,
      },
      nrOfValidationsByActivity: {
        "ac123f69-a27e-433c-9455-480cf3f5c31d": 2,
        "3e766a76-bd5e-480b-800f-31d1611b1e73": 9,
        "32897c1a-da97-40c2-a9f5-8305fc310750": 5,
      },
      nrOfSubmissionsByActivityAndResult: {
        "ac123f69-a27e-433c-9455-480cf3f5c31d": {
          ACCEPT: 2,
        },
        "3e766a76-bd5e-480b-800f-31d1611b1e73": {
          WRONG_ANSWER: 2,
          RUNTIME_ERROR: 2,
          ACCEPT: 1,
        },
        "32897c1a-da97-40c2-a9f5-8305fc310750": {
          WRONG_ANSWER: 3,
          ACCEPT: 1,
        },
        "db6a4f54-2aeb-4502-823a-92914aa8e60b": {
          ACCEPT: 1,
        },
      },
      nrOfValidationsByActivityAndResult: {
        "ac123f69-a27e-433c-9455-480cf3f5c31d": {
          ACCEPT: 2,
        },
        "3e766a76-bd5e-480b-800f-31d1611b1e73": {
          RUNTIME_ERROR: 5,
          ACCEPT: 4,
        },
        "32897c1a-da97-40c2-a9f5-8305fc310750": {
          ACCEPT: 5,
        },
      },
      __typename: "PlayerStats",
    },
    __typename: "Player",
  },
};

export default mockPlayerData;
