import styled from "@emotion/styled";
import React, { useLayoutEffect, useState } from "react";
import {
  PlayerGameProfiles,
  PlayerGameProfiles_myGameProfiles,
  PlayerGameProfiles_myGameProfiles_rewards_reward,
} from "../generated/PlayerGameProfiles";
import {
  Box,
  Flex,
  Heading,
  Tooltip,
  useColorModeValue,
  IconButton,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { RewardType } from "../generated/globalTypes";
import { AnimatePresence, motion } from "framer-motion";

import { VscDebugBreakpointLog } from "react-icons/vsc";
import { MdCheckCircle, MdDateRange } from "react-icons/md";
import { RiGamepadFill } from "react-icons/ri";

import dayjs from "dayjs";

const getRewardsCount = (gameProfiles: PlayerGameProfiles_myGameProfiles[]) => {
  const rewards = gameProfiles.map((gameProfile, i, array) => {
    return (
      gameProfile.rewards.length > 0 &&
      gameProfile.rewards.map(({ reward }, i) => {
        if (
          reward.kind != RewardType.BADGE &&
          reward.kind != RewardType.VIRTUAL_ITEM
        ) {
          return;
        }
        return reward;
      })
    );
  });

  return rewards.length;
};

const getGridDimensions = (rewardsCount: number) => {
  if (rewardsCount == 1) {
    return { columns: 1, rows: 1 };
  }
  const sqrt = Math.sqrt(rewardsCount);
  // Math.ceil(Math.sqrt(arrayLength) * 2)}
  const columns = Math.floor(sqrt * 2) || 1;
  const rows = Math.ceil(sqrt / 2) || 1;
  return { columns, rows };
};

const Rewards = ({ data }: { data: PlayerGameProfiles }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [
    rewardForModal,
    setRewardForModal,
  ] = useState<null | PlayerGameProfiles_myGameProfiles_rewards_reward>(null);

  const gameProfiles = data.myGameProfiles
    .flatMap((i) => [i, i])
    .flatMap((i) => [i, i]);

  // .splice(0, 23);
  // .flatMap((i) => [i, i]);

  const color = useColorModeValue("gray.100", "gray.700");
  const rewardColor = useColorModeValue("gray.200", "gray.800");
  const [zoom, setZoom] = useState(false);

  const [showRewardsAlert, setShowRewardsAlert] = useState(true);

  return (
    <>
      <RewardModal
        isOpen={isOpen && rewardForModal != null}
        onClose={onClose}
        reward={rewardForModal}
      />
      <Box>
        <Heading as="h3" size="md">
          Rewards
        </Heading>
        <Box position="relative">
          <Button
            onClick={() => setZoom(!zoom)}
            position="absolute"
            right={4}
            bottom={4}
            zIndex="999"
            colorScheme="teal"
            size="sm"
            opacity={0.7}
            _hover={{ opacity: 1 }}
          >
            Toggle view
          </Button>

          <RewardsWrapper bg={color}>
            <DynamicGrid
              gridDimensions={getGridDimensions(getRewardsCount(gameProfiles))}
              className={zoom ? "zoom" : ""}
            >
              {data &&
                gameProfiles.map((gameProfile, i, array) => {
                  return (
                    gameProfile.rewards.length > 0 &&
                    gameProfile.rewards.map(({ reward }, i) => {
                      if (
                        reward.kind != RewardType.BADGE &&
                        reward.kind != RewardType.VIRTUAL_ITEM
                      ) {
                        return;
                      }
                      if (showRewardsAlert) {
                        setShowRewardsAlert(false);
                      }
                      return (
                        <RewardStyle
                          textAlign="center"
                          bg={rewardColor}
                          cursor="pointer"
                          key={i}
                          onClick={() => {
                            setRewardForModal(reward);
                            onOpen();
                          }}
                        >
                          <RewardImage imageData={reward.image} zoom={zoom} />
                          <AnimatePresence>
                            {(zoom || gameProfiles.length < 12) && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  maxHeight: 0,
                                  maxWidth: 0,
                                  transform: "scale(0)",
                                }}
                                animate={{
                                  opacity: 1,
                                  maxHeight: 40,
                                  maxWidth: 120,
                                  transform: "scale(1)",
                                }}
                                exit={{
                                  opacity: 0,
                                  maxHeight: 0,
                                  maxWidth: 0,
                                  transform: "scale(0)",
                                }}
                                transition={{ duration: 0.2 }}
                                className={"name" + (zoom ? " show" : "")}
                              >
                                <div>{reward.name}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* <p>{reward.description}</p> */}
                        </RewardStyle>
                      );
                    })
                  );
                })}
            </DynamicGrid>
            {showRewardsAlert && "You will see your rewards here"}
          </RewardsWrapper>
        </Box>
      </Box>
    </>
  );
};

const RewardModal = ({
  isOpen,
  onClose,
  reward,
}: {
  isOpen: boolean;
  onClose: () => void;
  reward: PlayerGameProfiles_myGameProfiles_rewards_reward | null;
}) => {
  return (
    <>
      {reward && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{reward.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box width="100%" height="250px">
                <RewardImage imageData={reward.image} />
              </Box>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  {reward.description}
                </ListItem>
                {reward.parentChallenge && (
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    Challenge: {reward.parentChallenge.name}
                  </ListItem>
                )}
                <ListItem>
                  <ListIcon as={MdDateRange} color="green.500" />
                  {dayjs(reward.createdAt).format("DD/MM/YYYY")}
                </ListItem>

                <ListItem>
                  <ListIcon as={RiGamepadFill} color="green.500" />
                  Game: {reward.game.name}
                </ListItem>

                <ListItem>
                  <ListIcon as={VscDebugBreakpointLog} color="green.500" />
                  Cost: {reward.cost}
                </ListItem>
              </List>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

const RewardImage = styled.div<{ imageData: string | null; zoom?: boolean }>`
  width: 85%;
  transition: height 0.5s;
  height: ${({ zoom }) => (zoom ? 55 : 75)}%;

  background: ${({ imageData }) =>
    imageData ? `url(${imageData})` : "#e2e2e2"};
  background-position: center;
  background-size: cover;
  border-radius: 5px;

  @media only screen and (max-width: 600px) {
    height: 95%;
    width: 95%;
  }
`;

const DynamicGrid = styled.div<{
  gridDimensions: { columns: number; rows: number };
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(
    ${({ gridDimensions }) => gridDimensions.columns},
    minmax(auto, 180px)
  );
  grid-template-rows: repeat(
    ${({ gridDimensions }) => gridDimensions.rows},
    minmax(auto, 180px)
  );

  gap: ${({ gridDimensions }) => (gridDimensions.columns > 20 ? 4 : 8)}px;
  @media only screen and (max-width: 600px) {
    gap: 4px;
  }

  justify-content: center;

  &.zoom {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-template-rows: repeat(auto-fill, 120px);
    grid-auto-rows: 120px;
    margin: auto;
    justify-content: center;
  }
`;

const RewardsWrapper = styled(Box)`
  width: 100%;
  height: 250px;
  margin-bottom: 10px;
  border-radius: 5px;

  .zoom-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
    cursor: pointer;
    z-index: 999;
  }

  /* display: flex;
  justify-content: center;
  align-items: center; */

  /* display: flex;
  flex-wrap: wrap;

  justify-content: center;
  align-items: center; */
  position: relative;

  /* .area {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  } */
  /* color: black; */
  overflow-x: hidden;
  overflow-y: scroll;
`;

const RewardStyle = styled(Flex)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  /* min-width: 150px; */
  /* margin: 5px; */
  /* padding-top: 10px; */
  justify-content: space-evenly;
  align-items: center;
  border-radius: 5px;
  user-select: none;

  transition: transform 0.5s;

  @media only screen and (max-width: 600px) {
    .name {
      display: none;
    }
    height: 75%;
  }

  .name.show {
    display: inline-block;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export default Rewards;
