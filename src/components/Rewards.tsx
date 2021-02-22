import styled from "@emotion/styled";
import React, { useState } from "react";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { RewardType } from "../generated/globalTypes";

const Rewards = ({ data }: { data: PlayerGameProfiles }) => {
  const color = useColorModeValue("gray.100", "gray.700");

  const [showRewardsAlert, setShowRewardsAlert] = useState(true);
  return (
    <RewardsWrapper bg={color}>
      {data &&
        data.myGameProfiles.map((gameProfile, i) => {
          return (
            gameProfile.rewards.length > 0 &&
            gameProfile.rewards.map(({ reward }, i) => {
              if (
                reward.kind == RewardType.UNLOCK ||
                reward.kind == RewardType.REVEAL
              ) {
                return;
              }
              if (showRewardsAlert) {
                setShowRewardsAlert(false);
              }
              return (
                <RewardStyle
                  key={i}
                  bg={"white"}
                  marginLeft={5}
                  textAlign="center"
                >
                  <RewardImage imageData={reward.image} />

                  <div>{reward.name}</div>
                </RewardStyle>
              );
            })
          );
        })}
      {showRewardsAlert && "You will see your rewards here"}
    </RewardsWrapper>
  );
};

const RewardImage = styled.div<{ imageData: string | null }>`
  width: 85%;
  height: 65%;
  background: ${({ imageData }) =>
    imageData ? `url(${imageData})` : "#e2e2e2"};
  background-position: center;
  background-size: cover;
  border-radius: 5px;
`;

const RewardsWrapper = styled(Box)`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: black; */
`;

const RewardStyle = styled(Flex)`
  width: 150px;
  height: 130px;
  display: flex;
  flex-direction: column;
  font-size: 13px;

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
