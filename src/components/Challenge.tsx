import { gql, useQuery, useSubscription } from "@apollo/client";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  FindChallenge,
  FindChallenge_challenge_refs,
  FindChallenge_profileInGame_learningPath,
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

interface ParamTypes {
  gameId: string;
  challengeId: string;
}

const FIND_CHALLENGE = gql`
  query FindChallenge($gameId: String!, $challengeId: String!) {
    challenge(gameId: $gameId, id: $challengeId) {
      id
      name
      description
      difficulty
      mode
      modeParameters
      locked
      hidden
      refs {
        id
        name
        statement
        pdf
        editorKind
        codeSkeletons {
          code
          extension
        }
      }
    }

    profileInGame(gameId: $gameId) {
      learningPath {
        startedAt
        openedAt
        endedAt

        refs {
          activity {
            id
          }
          solved
        }
      }
    }

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

  const { add: addNotification } = useNotifications();
  const [challengeStatus, setChallengeStatus] =
    useState<{
      startedAt: string;
      endedAt: string;
      openedAt: string;
    }>();

  const [activeExercise, setActiveExercise] =
    useState<null | FindChallenge_challenge_refs>(null);
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
        setActiveExercise(data.challenge.refs[0]);
      }
    },
  });

  const checkIfSolved = (
    challengeData: FindChallenge,
    exercise: FindChallenge_challenge_refs | null
  ) => {
    let solved = false;

    if (!exercise) {
      return false;
    }

    challengeData.profileInGame.learningPath.map((learningPath) => {
      return learningPath.refs.forEach((ref) => {
        if (ref.activity?.id === exercise.id) {
          !challengeStatus &&
            setChallengeStatus({
              startedAt: learningPath.startedAt,
              endedAt: learningPath.endedAt,
              openedAt: learningPath.openedAt,
            });

          if (ref.solved) {
            solved = true;
          }
        }
      });
    });

    return solved;
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

    const learningPathMap = challengeData.profileInGame.learningPath;
    const challenges = challengeData.challenge.refs;
    let foundUnsolvedExercise = false;
    learningPathMap.forEach((learningPath) => {
      for (let x = 0; x < learningPath.refs.length; x++) {
        for (let i = 0; i < challenges.length; i++) {
          if (!learningPath.refs[x].solved) {
            if (challenges[i].id === learningPath.refs[x].activity?.id) {
              if (activeExercise?.id === learningPath.refs[x].activity?.id) {
                continue;
              } else {
                foundUnsolvedExercise = true;
                setActiveExercise(challenges[i]);
                break;
              }
            }
          }
        }

        if (!learningPath.refs[x].solved) {
          if (activeExercise?.id === learningPath.refs[x].activity?.id) {
            continue;
          } else {
            break;
          }
        }
      }
    });

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
      <Flex h="100%" w="100%">
        <Box
          width={[2 / 12]}
          maxWidth={330}
          height="100%"
          borderRight="1px solid rgba(0,0,0,0.1)"
          position="relative"
        >
          {challengeStatus &&
            challengeData?.challenge.mode === Mode.TIME_BOMB &&
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

                  <Countdown date={dayjs(challengeStatus.endedAt).valueOf()} />
                </Button>
              </Flex>
            )}

          <Box p={{ base: 1, md: 5 }} h="100%" w="100%">
            <Flex flexDirection="column" alignItems="center" w="100%">
              {!challengeLoading &&
                challengeData &&
                challengeData.challenge.refs.map((exercise, i) => {
                  return (
                    <Button
                      marginBottom={2}
                      w="100%"
                      size="sm"
                      fontSize={12}
                      key={i}
                      colorScheme={
                        exercise.id === activeExercise?.id ? "blue" : "gray"
                      }
                      className={
                        "exercise " +
                        (exercise.id === activeExercise?.id ? "active" : "")
                      }
                      onClick={() => setActiveExercise(exercise)}
                      rightIcon={
                        checkIfSolved(challengeData, exercise) ? (
                          <CheckIcon />
                        ) : undefined
                      }
                    >
                      <Text
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {i + 1}. {exercise.name}
                      </Text>
                    </Button>
                  );
                })}
            </Flex>
          </Box>
        </Box>

        {!challengeLoading && challengeData && (
          <Exercise
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
    </Playground>
  );
};

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
