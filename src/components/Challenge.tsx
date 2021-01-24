import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import {
  FindChallenge,
  FindChallenge_challenge_refs,
} from "../generated/FindChallenge";

import styled from "@emotion/styled";
import { Flex, Box, Button, Stack, Skeleton } from "@chakra-ui/react";

import Exercise from "./Exercise";
import { useParams } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";

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
  exercise: FindChallenge_challenge_refs
) => {
  let solved = false;

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

const Challenge = ({
  location,
}: {
  location: { state: { gameId: string; challengeId: string } };
}) => {
  const { gameId, challengeId } = useParams<ParamTypes>();
  const [
    activeExercise,
    setActiveExercise,
  ] = useState<null | FindChallenge_challenge_refs>(null);

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

  if (!challengeData && !challengeLoading) {
    return <div>Couldn't load challengeData</div>;
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
