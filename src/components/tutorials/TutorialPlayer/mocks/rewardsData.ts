const mockRewardsData = {
  player: {
    id: "6278d437384d748850cb3e34",
    rewards: [
      {
        id: "6278f032e05695e2e37849c1",
        reward: {
          id: "60e8ad92c88f75021f72d21b",
          kind: "UNLOCK",
          name: "Code Champion",
          description:
            "Exceptional problem solver and produces high-quality code.",
          __typename: "Reward",
        },
        __typename: "PlayerReward",
      },
      {
        id: "6278f032e0569593be7849c3",
        reward: {
          id: "60e8ad92c88f7569cb72d213",
          kind: "BADGE",
          name: "Bug Buster",
          description: "You have strong debugging skills.",
          __typename: "Reward",
        },
        __typename: "PlayerReward",
      },
      {
        id: "6278f23de0569569887849d2",
        reward: {
          id: "60e8ad92c88f750f6572d218",
          kind: "BADGE",
          name: "Speedy Coder",
          description: "Fast and accurate completion of programming tasks.",
          __typename: "Reward",
        },
        __typename: "PlayerReward",
      },
    ],
    __typename: "Player",
  },
};

export default mockRewardsData;
