import { gql, useQuery, useSubscription } from "@apollo/client";
import { CheckIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  Icon,
  IconButton,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  FindChallenge,
  FindChallenge_myChallengeStatus_refs,
} from "../generated/FindChallenge";
import { Mode, RewardType, State } from "../generated/globalTypes";
import {
  rewardReceivedStudentSubscription,
  rewardReceivedStudentSubscription_rewardReceivedStudent_reward,
} from "../generated/rewardReceivedStudentSubscription";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";
import Exercise from "./Exercise";
import { useNotifications } from "./Notifications";
import Countdown from "react-countdown";
import { BiTimer } from "react-icons/bi";
import { challengeStatusUpdatedStudentSub } from "../generated/challengeStatusUpdatedStudentSub";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ScrollbarWrapper from "./ScrollbarWrapper";
import NavGameButton from "./NavGameButton";

interface ParamTypes {
  gameId: string;
  challengeId: string;
}

const FIND_CHALLENGE = gql`
  query FindChallenge($gameId: String!, $challengeId: String!) {
    game(id: $gameId) {
      id
      name
    }

    myChallengeStatus(gameId: $gameId, challengeId: $challengeId) {
      startedAt
      endedAt
      openedAt

      challenge {
        mode
      }

      refs {
        activity {
          id
          pdf
          statement
          editorKind
          name
          title
          codeSkeletons {
            extension
            code
          }
        }
        solved
      }
    }

    # challenge(gameId: $gameId, id: $challengeId) {
    #   id
    #   name
    #   description
    #   difficulty
    #   mode
    #   modeParameters
    #   locked
    #   hidden
    #   refs {
    #     id
    #     name
    #     statement
    #     pdf
    #     editorKind
    #     codeSkeletons {
    #       code
    #       extension
    #     }
    #   }
    # }

    # profileInGame(gameId: $gameId) {
    #   learningPath {
    #     startedAt
    #     openedAt
    #     endedAt

    #     refs {
    #       activity {
    #         id
    #       }
    #       solved
    #     }
    #   }
    # }

    programmingLanguages(gameId: $gameId) {
      id
      name
      extension
    }
  }
`;

const REWARD_RECEIVED_STUDENT_SUB = gql`
  subscription rewardReceivedStudentSubscription($gameId: String!) {
    rewardReceivedStudent(gameId: $gameId) {
      count
      id
      reward {
        kind
        image
        name
        message
        description
      }
    }
  }
`;

const CHALLENGE_STATUS_UPDATED_STUDENT_SUB = gql`
  subscription challengeStatusUpdatedStudentSub($gameId: String!) {
    challengeStatusUpdatedStudent(gameId: $gameId) {
      openedAt
      endedAt
      startedAt
      state
    }
  }
`;

const Challenge = () => {
  const { gameId, challengeId } = useParams<ParamTypes>();
  const { t } = useTranslation();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { colorMode } = useColorMode();

  const { add: addNotification } = useNotifications();
  const [challengeStatus, setChallengeStatus] =
    useState<{
      startedAt: string;
      endedAt: string;
      openedAt: string;
    }>();

  const [activeExercise, setActiveExercise] =
    useState<null | FindChallenge_myChallengeStatus_refs>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [hints, setHints] = useState<
    rewardReceivedStudentSubscription_rewardReceivedStudent_reward[]
  >([]);

  const { error: subUpdatedChallengeStatusError } =
    useSubscription<challengeStatusUpdatedStudentSub>(
      CHALLENGE_STATUS_UPDATED_STUDENT_SUB,
      {
        skip: !gameId,
        variables: { gameId },
        onSubscriptionData: ({ subscriptionData }) => {
          if (subscriptionData.data) {
            console.log(
              "Subscription - CHALLENGE STATUS UPDATED",
              subscriptionData.data
            );
            const challengeStatusUpdated =
              subscriptionData.data.challengeStatusUpdatedStudent;

            if (challengeStatusUpdated.state === State.FAILED) {
              addNotification({
                status: "warning",
                title: t("timeIsUp.title"),
                description: t("timeIsUp.description"),
              });
            }

            setChallengeStatus({
              endedAt: challengeStatusUpdated.endedAt,
              startedAt: challengeStatusUpdated.startedAt,
              openedAt: challengeStatusUpdated.openedAt,
            });
          }
        },
      }
    );

  const { error: subRewardsError } =
    useSubscription<rewardReceivedStudentSubscription>(
      REWARD_RECEIVED_STUDENT_SUB,
      {
        skip: !gameId,
        variables: { gameId },
        onSubscriptionData: ({ subscriptionData }) => {
          console.log("Got subscription data", subscriptionData);

          if (subscriptionData.data) {
            addNotification({
              status:
                subscriptionData.data.rewardReceivedStudent.reward.kind ===
                RewardType.HINT
                  ? "info"
                  : "success",
              title: subscriptionData.data.rewardReceivedStudent.reward.name,
              description:
                subscriptionData.data.rewardReceivedStudent.reward.description,
              rewardImage:
                subscriptionData.data.rewardReceivedStudent.reward.image,
              rewardKind:
                subscriptionData.data.rewardReceivedStudent.reward.kind,
              showFireworks:
                subscriptionData.data.rewardReceivedStudent.reward.kind ===
                  RewardType.BADGE ||
                subscriptionData.data.rewardReceivedStudent.reward.kind ===
                  RewardType.VIRTUAL_ITEM,
            });
          }

          if (
            subscriptionData.data?.rewardReceivedStudent.reward.kind ===
            RewardType.HINT
          ) {
            setHints([
              ...hints,
              subscriptionData.data.rewardReceivedStudent.reward,
            ]);
          }
        },
      }
    );

  const {
    data: challengeData,
    error: challengeError,
    loading: challengeLoading,
    refetch: challengeRefetch,
  } = useQuery<FindChallenge>(FIND_CHALLENGE, {
    variables: { gameId, challengeId },
    onCompleted: (data) => {
      if (!activeExercise) {
        setActiveExercise(data.myChallengeStatus.refs[0]);
      }
    },
  });

  const checkIfSolved = (
    challengeData: FindChallenge,
    activeExercise: FindChallenge_myChallengeStatus_refs | null
  ): boolean => {
    if (!challengeStatus) {
      setChallengeStatus({
        startedAt: challengeData.myChallengeStatus.startedAt,
        endedAt: challengeData.myChallengeStatus.endedAt,
        openedAt: challengeData.myChallengeStatus.openedAt,
      });
    }

    if (!activeExercise) {
      return false;
    }

    if (activeExercise.solved) {
      return true;
    }

    return false;

    // setChallengeStatus(challengeData.myChallengeStatus)

    // setChallengeStatus({
    //   startedAt: learningPath.startedAt,
    //   endedAt: learningPath.endedAt,
    //   openedAt: learningPath.openedAt,
    // });

    // // challengeData.profileInGame.learningPath.map((learningPath) => {
    // //    learningPath.refs.forEach((ref) => {
    // //     if (ref.activity?.id === exercise.id) {
    // //       !challengeStatus &&
    // //         setChallengeStatus({
    // //           startedAt: learningPath.startedAt,
    // //           endedAt: learningPath.endedAt,
    // //           openedAt: learningPath.openedAt,
    // //         });

    // //       if (ref.solved) {
    // //         solved = true;
    // //       }
    // //     }
    // //   });
    // // });
  };

  if (challengeError) {
    console.log("challengeError", challengeError);
  }

  // useEffect(() => {
  //   if (challengeData) {
  //     // getFirstUnsolvedExercise(challengeData);
  //     //
  //     setActiveExercise(challengeData.challenge.refs[0]);
  //   }
  // }, [challengeLoading]);

  if (!gameId || !challengeId) {
    return <div>Game ID or Challenge ID not provided</div>;
  }

  // if (challengeLoading) {
  //   return (
  //     <Stack>
  //       <Skeleton>
  //         <Playground>
  //           <Flex h="100%" w="100%" />
  //         </Playground>
  //       </Skeleton>
  //     </Stack>
  //   );
  // }
  console.log("CHALLENGE DATA", challengeData);
  console.log("CHALLENGE STATUS", challengeStatus);
  /** Redirects to main course page if there are no more unsolved exercises. */
  const setNextUnsolvedExercise = () => {
    if (!challengeData) {
      return;
    }

    let foundUnsolvedExercise = false;

    const refs = challengeData?.myChallengeStatus.refs;
    for (let i = 0; i < refs.length; i++) {
      if (!refs[i].solved) {
        foundUnsolvedExercise = true;
        setActiveExercise(refs[i]);
        break;
      }
    }

    if (!foundUnsolvedExercise) {
      setShouldRedirect(true);
    }
  };

  if (!challengeLoading && challengeError) {
    const isServerConnectionError = checkIfConnectionAborted(challengeError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(challengeError)} />;
    }
  }

  if (!challengeData && !challengeLoading) {
    return <div>Couldn't load challengeData</div>;
  }

  if (shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: `/game/${gameId}`,
        }}
      />
    );
  }

  return (
    <Playground>
      {challengeData?.game.name && (
        <NavGameButton gameName={challengeData.game.name} gameId={gameId} />
      )}
      <MotionBox
        animate={{
          opacity: sideMenuOpen ? 1 : 0,
        }}
        pointerEvents={sideMenuOpen ? "all" : "none"}
        left={0}
        top={0}
        position="fixed"
        zIndex={998}
        height="100%"
        width="100%"
        backgroundColor="rgba(0,0,0,0.5)"
        onClick={() => {
          setSideMenuOpen(false);
        }}
      />
      <ScrollbarWrapper>
        <Flex h="100%" w="100%">
          <MotionBox
            position={{ base: "fixed", md: "relative" }}
            top={{ base: 0, md: "auto" }}
            background={{
              base: colorMode !== "dark" ? "gray.200" : "gray.900",
              md: "none",
            }}
            zIndex={999}
            left={{ md: "0 !important" }}
            animate={{
              left: sideMenuOpen ? "0%" : "-50%",
            }}
            width={{ base: "50%", md: 2 / 12 }}
            // backgroundColor="white"
            maxWidth={{ base: "100%", md: 330 }}
            // paddingTop={5}
            height="100%"
            overflowY="scroll"
            borderRight="1px solid rgba(0,0,0,0.1)"
            // position="relative"
            className="better-scrollbar"
          >
            <Box
              position="absolute"
              left={"calc(100% + 20px)"}
              display={{ base: "block", md: "none" }}
              opacity={sideMenuOpen ? 1 : 0}
              pointerEvents={sideMenuOpen ? "all" : "none"}
            >
              <IconButton
                colorScheme="blue"
                height="50px"
                width="30px"
                position="fixed"
                size="xl"
                zIndex={2000}
                top="50%"
                transform="translate(-50%, -50%)"
                aria-label="Open / Close"
                icon={sideMenuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
              />
            </Box>

            {challengeStatus &&
              challengeData?.myChallengeStatus.challenge.mode ===
                Mode.TIME_BOMB &&
              challengeStatus.openedAt &&
              challengeStatus.startedAt &&
              challengeStatus.endedAt && (
                <Flex
                  position="absolute"
                  bottom={10}
                  width="100%"
                  justifyContent="center"
                  height="50px"
                  alignItems="center"
                >
                  <Button cursor="auto" _focus={{}} _active={{}}>
                    <Icon as={BiTimer} marginRight={2} />

                    <Countdown
                      date={dayjs(challengeStatus.endedAt).valueOf()}
                    />
                  </Button>
                </Flex>
              )}
            <Box p={{ base: 1, md: 5 }} h="100%" w="100%" position="relative">
              <Flex
                flexDirection="column"
                alignItems="center"
                w="100%"
                // height="100%"
                overflowY="hidden"
              >
                {!challengeLoading &&
                  challengeData &&
                  challengeData.myChallengeStatus.refs.map((exercise, i) => {
                    if (!exercise.activity) {
                      return;
                    }
                    return (
                      <Button
                        marginBottom={2}
                        w="100%"
                        size="sm"
                        fontSize={12}
                        key={i}
                        colorScheme={
                          exercise.activity.id === activeExercise?.activity?.id
                            ? "blue"
                            : "gray"
                        }
                        className={
                          "exercise " +
                          (exercise.activity.id === activeExercise?.activity?.id
                            ? "active"
                            : "")
                        }
                        onClick={() => setActiveExercise(exercise)}
                        rightIcon={exercise.solved ? <CheckIcon /> : undefined}
                      >
                        <Text
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {i + 1}. {exercise.activity.name}
                        </Text>
                      </Button>
                    );
                  })}
              </Flex>
            </Box>
          </MotionBox>

          {!challengeLoading && challengeData && (
            <Exercise
              setSideMenuOpen={() => {
                setSideMenuOpen(true);
              }}
              gameId={gameId}
              challengeId={challengeId}
              exercise={activeExercise}
              programmingLanguages={challengeData.programmingLanguages}
              challengeRefetch={challengeRefetch}
              solved={checkIfSolved(challengeData, activeExercise)}
              setNextUnsolvedExercise={setNextUnsolvedExercise}
              hints={hints}
            />
          )}
        </Flex>
      </ScrollbarWrapper>
    </Playground>
  );
};

export const MotionBox = motion.custom(Box);

const Playground = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 65px);
  top: 65px;
  left: 0;

  & > div {
    width: 100%;
  }
`;

export default withChangeAnimation(Challenge);
