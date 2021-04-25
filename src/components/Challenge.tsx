import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import {
  FindChallenge,
  FindChallenge_challenge_refs,
} from "../generated/FindChallenge";
import Error from "./Error";

import styled from "@emotion/styled";
import { Flex, Box, Button, Stack, Skeleton } from "@chakra-ui/react";

import Exercise from "./Exercise";
import { Redirect, useParams } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import { getPlayerIdQuery } from "../generated/getPlayerIdQuery";
import { rewardReceivedStudentSubscription } from "../generated/rewardReceivedStudentSubscription";
import { useNotifications } from "./Notifications";
import { RewardType } from "../generated/globalTypes";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../utilities/ErrorMessages";

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
    return learningPath.refs.map((ref, i) => {
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

  const [
    activeExercise,
    setActiveExercise,
  ] = useState<null | FindChallenge_challenge_refs>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    data: subRewardsData,
    loading: subRewardsLoading,
    error: subRewardsError,
  } = useSubscription<rewardReceivedStudentSubscription>(
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
            rewardKind: subscriptionData.data.rewardReceivedStudent.reward.kind,
            showFireworks:
              subscriptionData.data.rewardReceivedStudent.reward.kind ===
                RewardType.BADGE ||
              subscriptionData.data.rewardReceivedStudent.reward.kind ===
                RewardType.VIRTUAL_ITEM,
          });
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
    learningPathMap.map((learningPath) => {
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
            exercise={activeExercise}
            programmingLanguages={challengeData.programmingLanguages}
            challengeRefetch={challengeRefetch}
            solved={checkIfSolved(challengeData, activeExercise)}
            setNextUnsolvedExercise={setNextUnsolvedExercise}
          />
        )}
      </Flex>
    </Playground>
    // <div>
    //   Challenge: {challengeId}
    //   <CodeEditor code={code} setCode={setCode} />
    // </div>
  );
};

const SideMenu = styled.div`
  display: flex;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);

  .active {
  }

  .exercise {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 100px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.5s, color 0.5s;

    &:hover {
      transform: scale(0.9);
    }
  }

  .exercise:first-of-type {
    margin-top: 10px;
  }
`;

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
