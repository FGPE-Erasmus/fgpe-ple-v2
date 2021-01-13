import styled from "@emotion/styled";
import React, { useState } from "react";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";

const Rewards = ({ data }: { data: PlayerGameProfiles }) => {
  const [showRewardsAlert, setShowRewardsAlert] = useState(true);
  return (
    <RewardsWrapper>
      {data
        ? data.myGameProfiles.map((gameProfile, i) => {
            return gameProfile.rewards.length > 0
              ? gameProfile.rewards.map(({ reward }, i) => {
                  if (showRewardsAlert) {
                    setShowRewardsAlert(false);
                  }
                  return (
                    <RewardStyle key={i}>
                      <RewardImage imageData={reward.image} />
                      <div>{reward.name}</div>
                    </RewardStyle>
                  );
                })
              : showRewardsAlert && "You will see your rewards here";
          })
        : showRewardsAlert && "You will see your rewards"}
    </RewardsWrapper>
  );
};

const RewardImage = styled.div<{ imageData: string | null }>`
  width: 85%;
  height: 65%;
  background: url(${({ imageData }) => (imageData ? imageData : "#323232")});
  background-position: center;
  background-size: cover;
  border-radius: 5px;
`;

const RewardsWrapper = styled.div`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.backgroundVariant};
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

const RewardStyle = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primary};
  width: 150px;
  height: 130px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  border-radius: 5px;
  transition: transform 0.5s;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`;

export default Rewards;
