import React, { useState, useEffect } from "react";
// import { Flex, Box } from "reflexbox";
import ReactHtmlParser from "react-html-parser";
import styled from "@emotion/styled";
import {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  ApolloQueryResult,
} from "@apollo/client";
import { getSubmissionByIdQuery } from "../../generated/getSubmissionByIdQuery";
import CodeEditor from "../CodeEditor";
import useInterval from "../../utilities/useInterval";
// import Loading from "./Loading";
import EditorMenu from "./EditorMenu";
import {
  Badge,
  Center,
  Flex,
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";

import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";

import {
  FindChallenge,
  FindChallenge_challenge_refs,
  FindChallenge_programmingLanguages,
} from "../../generated/FindChallenge";
import Statement, { getStatement, getStatementLength } from "./Statement";
import { Result } from "../../generated/globalTypes";

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
  mutation evaluateSubmissionQuery(
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

const Exercise = ({
  gameId,
  exercise,
  programmingLanguages,
  challengeRefetch,
}: {
  gameId: string;
  exercise: FindChallenge_challenge_refs | null;
  programmingLanguages: FindChallenge_programmingLanguages[];
  challengeRefetch: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<FindChallenge>>;
}) => {
  const [code, setCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(programmingLanguages[0]);

  const [fetchingCount, setFetchingCount] = useState(0);

  const [submissionFeedback, setSubmissionFeedback] = useState("Ready");
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);

  const [isSubmissionFetching, setSubmissionFetching] = useState(false);
  const [submissionId, setSubmissionId] = useState<null | string>(null);

  useEffect(() => {
    setCode("");
    setSubmissionFeedback("Ready");
    setSubmissionResult(null);
  }, [exercise]);

  useEffect(() => {
    if (submissionResult == Result.ACCEPT) {
      challengeRefetch();
    }
  }, [submissionResult]);

  useInterval(
    () => {
      if (submissionError) {
        setFetchingCount(0);
        setSubmissionFetching(false);
      }

      if (fetchingCount > 7) {
        setFetchingCount(0);
        setSubmissionFetching(false);
      }

      if (!submissionData?.submission.feedback) {
        console.log("Checking the result...");
        setFetchingCount(fetchingCount + 1);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      } else {
        console.log("Submission", submissionData);
        setSubmissionFetching(false);
        setSubmissionFeedback(submissionData.submission.feedback);
        setSubmissionResult(submissionData.submission.result);
      }
    },
    // Delay in milliseconds or null to stop it
    isSubmissionFetching ? 1000 : null
  );

  const [
    getSubmissionById,
    {
      loading: isSubmissionLoading,
      data: submissionData,
      error: submissionError,
    },
  ] = useLazyQuery<getSubmissionByIdQuery>(GET_SUBMISSION_BY_ID, {
    fetchPolicy: "network-only",
  });

  const [evaluateSubmissionMutation, { data: evaluationData }] = useMutation(
    UPLOAD_SUBMISSION,
    {
      onCompleted(data) {
        const submissionId = data.evaluate.id;
        console.log("DATA EVALUATE", data);
        console.log("SUBMISSION", submissionId);
        setSubmissionFetching(true);
        setSubmissionId(submissionId);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      },
    }
  );

  const evaluateSubmission = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const file = new File([blob], `Solution.${activeLanguage.extension}`);

    evaluateSubmissionMutation({
      variables: { file, gameId, exerciseId: exercise?.id },
    });
  };

  const validateSubmission = () => {};

  return (
    <Box width={"100%"} height={"100%"} m={0} p={0}>
      <Statement exercise={exercise} />
      <EditorMenu
        submissionResult={submissionResult}
        activeLanguage={activeLanguage}
        setActiveLanguage={setActiveLanguage}
        evaluateSubmission={evaluateSubmission}
        validateSubmission={validateSubmission}
        isSubmissionFetching={isSubmissionFetching}
        setFetchingCount={setFetchingCount}
        setSubmissionFetching={setSubmissionFetching}
        programmingLanguages={programmingLanguages}
      />

      <Flex
        height={`calc(100% - ${200 + getStatementLength(exercise) / 5}px)`}
        minHeight={500}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box
          width={{ base: "99%", md: "58%" }}
          height={{ base: "50vh", md: "100%" }}
          minHeight="50vh"
          p={0}
          m={0}
        >
          <CodeEditor language={activeLanguage} code={code} setCode={setCode} />
        </Box>
        <Box
          width={{ base: "99%", md: "42%" }}
          height={{ base: "50vh", md: "100%" }}
          minHeight="50vh"
        >
          <Terminal>
            <div>
              {submissionResult == Result.COMPILATION_ERROR
                ? submissionFeedback
                : ReactHtmlParser(
                    submissionFeedback ? submissionFeedback : "Waiting..."
                  )}
            </div>
          </Terminal>
        </Box>
      </Flex>
    </Box>
  );
};

const Terminal = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #323232;
  color: white;
  padding: 12px;
  margin: 0px;
  font-size: 13px;
  font-family: "Source Code Pro", monospace;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;
  & > div {
    margin: auto;
    width: 90%;
    position: absolute;
  }
`;

export default Exercise;
