import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import CodeEditor from "./CodeEditor";
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
import { start } from "repl";

const GET_SUBMISSION_BY_ID = gql`
  query getSubmissionByIdQuery($gameId: String!, $submissionId: String!) {
    submission(gameId: $gameId, id: $submissionId) {
      id
      game {
        id
      }
      player {
        id
      }
      exerciseId
      evaluationEngine
      evaluationEngineId
      language
      metrics
      result
      feedback
      submittedAt
      evaluatedAt
      program
    }
  }
`;

const UPLOAD_SUBMISSION = gql`
  mutation uploadSubmissionQuery(
    $exerciseId: String!
    $gameId: String!
    $file: Upload!
  ) {
    evaluate(gameId: $gameId, exerciseId: $exerciseId, file: $file) {
      id
      game {
        id
      }
      player {
        user {
          username
        }
      }
      feedback
      exerciseId
      evaluationEngine
      evaluationEngineId
    }
  }
`;

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

const getStatement = (exercise: FindChallenge_challenge_refs | null) => {
  if (!exercise) {
    return "No description";
  }

  if (exercise.statement) {
    return exercise.statement;
  } else {
    return "No description";
  }
};

const Challenge = ({
  location,
}: {
  location: { state: { gameId: string; challengeId: string } };
}) => {
  const { gameId, challengeId } = location.state;
  const [code, setCode] = useState("");
  const [submissionId, setSubmissionId] = useState<null | string>(null);

  const [isSubmissionFetching, setSubmissionFetching] = useState(false);
  const [fetchingCount, setFetchingCount] = useState(0);
  const [lastSubmissionId, setLastSubmissionId] = useState<null | string>(null);

  const {
    data: challengeData,
    error: challengeError,
    loading: challengeLoading,
  } = useQuery<FindChallenge>(FIND_CHALLENGE, {
    variables: { gameId, challengeId },
  });

  const [
    getSubmissionById,
    {
      loading: isSubmissionLoading,
      data: submissionData,
      error: submissionError,
    },
  ] = useLazyQuery<getSubmissionByIdQuery>(GET_SUBMISSION_BY_ID);

  useInterval(
    () => {
      console.log("submission data", submissionData);
      if (submissionError) {
        setFetchingCount(0);
        setSubmissionFetching(false);
      }

      if (fetchingCount > 7) {
        setFetchingCount(0);
        setSubmissionFetching(false);
      }

      if (lastSubmissionId) {
        if (submissionData?.submission.id == lastSubmissionId) {
          //   setFetchingCount(fetchingCount + 1);
          // getSubmissionById({
          //   variables: { gameId, submissionId },
          // });
          console.log("Finally?", submissionData);
        }
      } else {
      }

      if (!submissionData?.submission.feedback) {
        console.log("Checking the result...");
        setFetchingCount(fetchingCount + 1);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      } else {
        console.log("Submission", submissionData);
        // setSubmissionFetching(false);
        setLastSubmissionId(submissionId);
      }
    },
    // Delay in milliseconds or null to stop it
    isSubmissionFetching ? 1000 : null
  );

  const [uploadSubmissionMutation, { data: evaluationData }] = useMutation(
    UPLOAD_SUBMISSION,
    {
      onCompleted(data) {
        const submissionId = data.evaluate.id;
        console.log("DATA EVALUATE", data);
        console.log("SUBMISSION", submissionId);
        setSubmissionId(submissionId);
        setSubmissionFetching(true);

        // getSubmissionById({
        //   variables: { gameId, submissionId },
        // });
      },
    }
  );

  const uploadSubmission = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const file = new File([blob], "exercise.py");

    uploadSubmissionMutation({
      variables: { file, gameId, exerciseId: activeExercise?.id },
    });
  };

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
        <Box className="test1" width={[2 / 12]} maxWidth={330}>
          <ol style={{ width: "100%" }}>
            {challengeData.challenge.refs.map((exercise, i) => {
              return (
                <li
                  key={i}
                  className={exercise.id === activeExercise?.id ? "active" : ""}
                  onClick={() => setActiveExercise(exercise)}
                >
                  {exercise.name}
                </li>
              );
            })}
          </ol>
        </Box>

        <Box width={"100%"} height={"100%"}>
          <Flex height={150} overflowY={"auto"}>
            <Box>
              <ExerciseDescription>
                {ReactHtmlParser(getStatement(activeExercise))}
              </ExerciseDescription>
            </Box>
          </Flex>
          <Flex height={50}>
            <Box width={7 / 12}>
              <button onClick={uploadSubmission}>Run</button>
            </Box>
            <Box width={5 / 12}>Status: empty</Box>
          </Flex>
          <Flex height={"calc(100% - 200px)"} flexDirection={["column", "row"]}>
            <Box width={[1, 7 / 12]} height={["auto", "100%"]} minHeight="50vh">
              <CodeEditor code={code} setCode={setCode} />
            </Box>
            <Box width={[1, 5 / 12]} height={["auto", "100%"]} minHeight="50vh">
              <Terminal>
                <button
                  onClick={() => {
                    setSubmissionFetching(false);
                  }}
                >
                  test
                </button>
                {submissionData?.submission.id}
                {ReactHtmlParser(
                  submissionData?.submission.feedback
                    ? submissionData?.submission.feedback
                    : ""
                )}

                {/* {submissionError
                  ? JSON.stringify(submissionError)
                  : "[No error]"} */}
              </Terminal>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Playground>
    // <div>
    //   Challenge: {challengeId}
    //   <CodeEditor code={code} setCode={setCode} />
    // </div>
  );
};

const ExerciseDescription = styled.div`
  padding: 15px;
`;

const Terminal = styled.div`
  font-family: "Source Code Pro", monospace;
  background-color: #323232;
  height: 100%;
  color: white;
  padding: 12px;
  overflow-y: auto;
`;

const Playground = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 65px);
  top: 65px;
  left: 0;

  li.active {
    color: red;
  }

  & > div {
    width: 100%;
  }

  .test1 {
    background-color: #929292;
  }

  .test {
    background-color: #323232;
  }
`;

export default withChangeAnimation(Challenge);
