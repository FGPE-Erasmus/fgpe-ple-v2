import { gql, useQuery, useSubscription } from "@apollo/client";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  FindChallenge,
  FindChallenge_challenge_refs,
} from "../generated/FindChallenge";
import { RewardType } from "../generated/globalTypes";
import {
  rewardReceivedStudentSubscription,
  rewardReceivedStudentSubscription_rewardReceivedStudent_reward,
} from "../generated/rewardReceivedStudentSubscription";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";
import Exercise from "./Exercise";
import { useNotifications } from "./Notifications";

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
        codeSkeletons {
          code
          extension
        }
      }
    }

    profileInGame(gameId: $gameId) {
      learningPath {
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
        if (ref.solved) {
          solved = true;
        }
      }
    });
  });

  return solved;
};

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

const Challenge = ({
  location,
}: {
  location: { state: { gameId: string; challengeId: string } };
}) => {
  const { gameId, challengeId } = useParams<ParamTypes>();
  const { add: addNotification } = useNotifications();

  const [activeExercise, setActiveExercise] =
    useState<null | FindChallenge_challenge_refs>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [hints, setHints] = useState<
    rewardReceivedStudentSubscription_rewardReceivedStudent_reward[]
  >([]);

  const { error: subRewardsError } =
    useSubscription<rewardReceivedStudentSubscription>(
      REWARD_RECEIVED_STUDENT_SUB,
      {
        variables: { gameId },
        onSubscriptionData: ({ subscriptionData }) => {
          if (subscriptionData.data) {
            addNotification({
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
        >
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
                      {i + 1}. {exercise.name}
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
