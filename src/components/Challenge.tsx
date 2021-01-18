import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import CodeEditor, { languages } from "./CodeEditor";
import useInterval from "../utilities/useInterval";
import {
  FindChallenge,
  FindChallenge_challenge_refs,
} from "../generated/FindChallenge";
import { getSubmissionByIdQuery } from "../generated/getSubmissionByIdQuery";
import { uploadSubmissionQuery } from "../generated/uploadSubmissionQuery";

import styled from "@emotion/styled";
import { Flex, Box } from "reflexbox";
import ReactHtmlParser from "react-html-parser";

import Exercise from "./Exercise";

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

    programmingLanguages(gameId: $gameId) {
      id
      name
      extension
    }
  }
`;

const Challenge = ({
  location,
}: {
  location: { state: { gameId: string; challengeId: string } };
}) => {
  const { gameId, challengeId } = location.state;

  const {
    data: challengeData,
    error: challengeError,
    loading: challengeLoading,
  } = useQuery<FindChallenge>(FIND_CHALLENGE, {
    variables: { gameId, challengeId },
  });

  if (challengeError) {
    console.log("challengeError", challengeError);
  }

  const [
    activeExercise,
    setActiveExercise,
  ] = useState<null | FindChallenge_challenge_refs>(null);

  useEffect(() => {
    if (challengeData) {
      setActiveExercise(challengeData.challenge.refs[0]);
    }
  }, [challengeData]);

  if (!gameId || !challengeId) {
    return <div>Game ID or Challenge ID not provided</div>;
  }

  if (challengeLoading) {
    return <div>Loading</div>;
  }

  if (!challengeData) {
    return <div>Couldn't load challengeData</div>;
  }

  return (
    <Playground>
      <Flex height={"100%"}>
        <Box width={[2 / 12]} maxWidth={330}>
          <SideMenu>
            <div>
              {challengeData.challenge.refs.map((exercise, i) => {
                return (
                  <div
                    key={i}
                    className={
                      "exercise " +
                      (exercise.id === activeExercise?.id ? "active" : "")
                    }
                    onClick={() => setActiveExercise(exercise)}
                  >
                    {i + 1}. {exercise.name}
                  </div>
                );
              })}
            </div>
          </SideMenu>
        </Box>

        <Exercise gameId={gameId} exercise={activeExercise} />
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
