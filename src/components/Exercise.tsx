import React, { useState, useEffect } from "react";
// import { Flex, Box } from "reflexbox";
import ReactHtmlParser from "react-html-parser";
import styled from "@emotion/styled";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { getSubmissionByIdQuery } from "../generated/getSubmissionByIdQuery";
import CodeEditor from "./CodeEditor";
import useInterval from "../utilities/useInterval";
// import Loading from "./Loading";
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
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";

import {
  FindChallenge,
  FindChallenge_challenge_refs,
  FindChallenge_profileInGame_learningPath,
  FindChallenge_programmingLanguages,
} from "../generated/FindChallenge";

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

const getColorSchemeForSubmissionResult = (submissionResult: string) => {
  return "red";
};

const Exercise = ({
  gameId,
  exercise,
  programmingLanguages,
}: {
  gameId: string;
  exercise: FindChallenge_challenge_refs | null;
  programmingLanguages: FindChallenge_programmingLanguages[];
}) => {
  const [code, setCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(programmingLanguages[0]);

  const [fetchingCount, setFetchingCount] = useState(0);

  const [submissionFeedback, setSubmissionFeedback] = useState("Ready");
  const [submissionResult, setSubmissionResult] = useState<null | string>("");

  const [isSubmissionFetching, setSubmissionFetching] = useState(false);
  const [submissionId, setSubmissionId] = useState<null | string>(null);

  useEffect(() => {
    setCode("");
    setSubmissionFeedback("Ready");
    setSubmissionResult("");
  }, [exercise]);

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

  const [uploadSubmissionMutation, { data: evaluationData }] = useMutation(
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

  const uploadSubmission = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const file = new File([blob], "exercise.py");

    uploadSubmissionMutation({
      variables: { file, gameId, exerciseId: exercise?.id },
    });
  };

  return (
    <Box width={"100%"} height={"100%"} m={0} p={0}>
      <Flex height={150} overflowY={"auto"}>
        <Box h="100%" w="100%" bgColor="gray.100">
          <Box bgColor="gray.100" p={5}>
            {ReactHtmlParser(getStatement(exercise))}
          </Box>
        </Box>
      </Flex>

      <Flex
        height={{ base: 100, md: 50 }}
        backgroundColor="gray.50"
        alignItems="center"
        p={2}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box width={{ base: "100%", md: 7 / 12 }}>
          <Flex width={"100%"} height={"100%"}>
            <Center width={(1 / 6) * 1.5}>
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      size="sm"
                      isActive={isOpen}
                      as={Button}
                      w="95%"
                      rightIcon={<ChevronDownIcon />}
                      fontSize={12}
                    >
                      {activeLanguage.name}
                    </MenuButton>
                    <MenuList>
                      {programmingLanguages.map((language, i) => (
                        <MenuItem
                          key={i}
                          onClick={() => setActiveLanguage(language)}
                        >
                          {language.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </Center>
            <Center width={1 / 6}>
              <Button
                size="sm"
                w="95%"
                onClick={uploadSubmission}
                isLoading={isSubmissionFetching}
                loadingText={"Stop"}
                disabled={false}
                colorScheme="blue"
              >
                Run
              </Button>
            </Center>
            <Center width={1 / 6}>
              <Button
                w="95%"
                size="sm"
                colorScheme="teal"
                variant="outline"
                disabled
              >
                Submit
              </Button>
            </Center>
            <Center width={1 / 6}>
              <Button size="sm" w="95%" disabled>
                Save
              </Button>
            </Center>
            <Center width={1 / 6}>
              <Button size="sm" w="95%" disabled>
                Restore
              </Button>
            </Center>
            <Center width={1 / 6 / 2}>
              <IconButton
                size="sm"
                w="95%"
                aria-label="Settings"
                icon={<SettingsIcon />}
                variant="outline"
              />
            </Center>
          </Flex>
        </Box>
        <Center width={{ base: "100%", md: 5 / 12 }}>
          <Box>
            Status:
            {submissionResult ? (
              <Badge
                m={3}
                colorScheme={getColorSchemeForSubmissionResult(
                  submissionResult
                )}
              >
                {submissionResult}
              </Badge>
            ) : (
              " -"
            )}
          </Box>
        </Center>
      </Flex>
      <Flex
        height={"calc(100% - 200px)"}
        minHeight={500}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box
          width={{ base: "99%", md: "58%" }}
          height={{ base: "auto", md: "100%" }}
          minHeight="30vh"
          p={0}
          m={0}
        >
          <CodeEditor language={activeLanguage} code={code} setCode={setCode} />
        </Box>
        <Box
          width={{ base: "99%", md: "42%" }}
          height={{ base: "auto", md: "100%" }}
          minHeight="30vh"
        >
          <Terminal>
            {ReactHtmlParser(
              submissionFeedback ? submissionFeedback : "Waiting..."
            )}
          </Terminal>
        </Box>
      </Flex>
    </Box>
  );
};

const StatusInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Button = styled.button<{ disabled?: boolean }>`
//   width: 100%;
//   height: 100%;
//   transition: transform 0.5s;
//   opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
//   pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
//   position: relative;

//   * {
//     display: inline-block;
//   }

//   .loading-indicator {
//     width: 12px;
//     height: 12px;
//   }

//   &:hover {
//     transform: scale(0.9);
//   }
// `;

const ExerciseDescription = styled.div`
  padding: 15px;
`;

const Terminal = styled.div`
  height: 100%;
  width: 100%;
  background-color: #323232;
  color: white;
  padding: 12px;
  font-size: 13px;
  font-family: "Source Code Pro", monospace;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;

  /* font-family: "Source Code Pro", monospace;
  background-color: #323232;
  height: 100%;
  color: white;
  padding: 12px;
  overflow-y: auto; */
`;

export default Exercise;
