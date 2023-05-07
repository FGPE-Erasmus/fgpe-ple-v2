import { allGameProfilesQuery } from "../../generated/allGameProfilesQuery";
import { teacherProfileTutorialData } from "../TutorialWizard/teacherProfileTutorialData";

const mockGameProfiles: allGameProfilesQuery = {
  allGameProfiles: teacherProfileTutorialData.map((profile) => ({
    id: profile.id,
    game: {
      id: profile.id,
      name: profile.name,
      __typename: "Game",
    },
    group: null,
    points: Math.floor(Math.random() * 500),
    rewards: Array(Math.floor((Math.random() + 1) * 10)).fill({
      id: "60d080e7fea1b16a47e1f315",
      reward: {
        name: "point1",
        __typename: "Reward",
      },
      __typename: "PlayerReward",
    }),
    stats: {
      nrOfSubmissions: Math.floor((Math.random() + 1) * 100),
      nrOfValidations: Math.floor((Math.random() + 1) * 100),
      __typename: "PlayerStats",
    },
    learningPath: Array(Math.floor(Math.random() * 10)).fill({
      progress: Math.random(),
      __typename: "ChallengeStatus",
    }),

    __typename: "Player",
  })),
};

export default mockGameProfiles;
