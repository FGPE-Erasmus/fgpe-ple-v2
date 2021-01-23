import React, { useState, useEffect, useRef } from "react";
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
import { Flex, Box, useDisclosure } from "@chakra-ui/react";

import {
  FindChallenge,
  FindChallenge_challenge_refs,
  FindChallenge_programmingLanguages,
} from "../../generated/FindChallenge";
import Statement, { getStatementLength } from "./Statement";
import { Result } from "../../generated/globalTypes";
import { SettingsContext } from "./SettingsContext";
import Terminal from "./Terminal";

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

const EVALUATE_SUBMISSION = gql`
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

const VALIDATE_SUBMISSION = gql`
  mutation validateSubmissionQuery(
    $exerciseId: String!
    $gameId: String!
    $file: Upload!
    $inputs: [String!]!
  ) {
    validate(
      gameId: $gameId
      exerciseId: $exerciseId
      file: $file
      inputs: $inputs
    ) {
      id
      game {
        id
      }
      player {
        user {
          username
        }
      }
      exerciseId
      evaluationEngine
      evaluationEngineId
    }
  }
`;

const getEditorTheme = () => {
  const editorTheme = localStorage.getItem("editorTheme");
  if (editorTheme) {
    return editorTheme;
  }
  return "light";
};

const getTerminalTheme = () => {
  const terminalTheme = localStorage.getItem("terminalTheme");
  if (terminalTheme) {
    return terminalTheme;
  }
  return "light";
};

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

  const [isEvaluationFetching, setEvaluationFetching] = useState(false);
  const [isValidationFetching, setValidationFetching] = useState(false);

  const [submissionId, setSubmissionId] = useState<null | string>(null);

  const [editorTheme, setEditorTheme] = useState("light");
  const [terminalTheme, setTerminalTheme] = useState("light");

  const [testValues, setTestValues] = useState<string[]>([]);

  const exerciseRef = useRef<FindChallenge_challenge_refs | null>(null);
  const activeLanguageRef = useRef<FindChallenge_programmingLanguages>(
    activeLanguage
  );
  const codeRef = useRef<string>(code);

  useEffect(() => {
    exerciseRef.current = exercise;
    activeLanguageRef.current = activeLanguage;
    codeRef.current = code;
  });

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Backslash") {
        evaluateSubmission();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.code === "Enter") {
        validateSubmission();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.code === "KeyM") {
        // validateSubmission();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.code === "Comma") {
        // validateSubmission();
        return;
      }
    });
  }, []);

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
        setEvaluationFetching(false);
      }

      if (fetchingCount > 7) {
        setFetchingCount(0);
        setEvaluationFetching(false);
      }

      if (!submissionData?.submission.feedback) {
        console.log("Checking the result...");
        setFetchingCount(fetchingCount + 1);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      } else {
        console.log("Submission", submissionData);
        setEvaluationFetching(false);
        setSubmissionFeedback(submissionData.submission.feedback);
        setSubmissionResult(submissionData.submission.result);
      }
    },
    // Delay in milliseconds or null to stop it
    isEvaluationFetching ? 1000 : null
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
    EVALUATE_SUBMISSION,
    {
      onCompleted(data) {
        const submissionId = data.evaluate.id;
        console.log("DATA EVALUATE", data);
        console.log("SUBMISSION - EVALUATE", submissionId);
        setEvaluationFetching(true);
        setSubmissionId(submissionId);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      },
    }
  );

  const [validateSubmissionMutation, { data: validationData }] = useMutation(
    VALIDATE_SUBMISSION,
    {
      onCompleted(data) {
        const submissionId = data.validate.id;
        console.log("DATA VALIDATE", data);
        console.log("SUBMISSION - VALIDATE", submissionId);
        setValidationFetching(true);
        setSubmissionId(submissionId);
        getSubmissionById({
          variables: { gameId, submissionId },
        });
      },
    }
  );

  const getFileFromCode = () => {
    const blob = new Blob([codeRef.current], { type: "text/plain" });
    const file = new File(
      [blob],
      `Solution.${activeLanguageRef.current.extension}`
    );

    return file;
  };

  const evaluateSubmission = () => {
    setEvaluationFetching(true);
    if (isEvaluationFetching) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("Evaluating submission...");

    const file = getFileFromCode();
    console.log("file", file);

    evaluateSubmissionMutation({
      variables: { file, gameId, exerciseId: exerciseRef.current?.id },
    });
  };

  const validateSubmission = () => {
    setValidationFetching(true);
    if (isValidationFetching) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("Validating submission...");

    const file = getFileFromCode();

    validateSubmissionMutation({
      variables: {
        file,
        gameId,
        exerciseId: exerciseRef.current?.id,
        inputs: ["1 2 3"],
      },
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        editorTheme: getEditorTheme(),
        setEditorTheme,
        terminalTheme: getTerminalTheme(),
        setTerminalTheme,
      }}
    >
      <Box width={"100%"} height={"100%"} m={0} p={0}>
        <Statement exercise={exercise} />
        <EditorMenu
          submissionResult={submissionResult}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          evaluateSubmission={evaluateSubmission}
          validateSubmission={validateSubmission}
          isValidationFetching={isValidationFetching}
          isEvaluationFetching={isEvaluationFetching}
          setFetchingCount={setFetchingCount}
          setSubmissionFetching={setEvaluationFetching}
          programmingLanguages={programmingLanguages}
          setValidationFetching={setValidationFetching}
          testValues={testValues}
          setTestValues={setTestValues}
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
            <CodeEditor
              language={activeLanguage}
              code={code}
              setCode={setCode}
              evaluateSubmission={evaluateSubmission}
            />
          </Box>
          <Box
            width={{ base: "99%", md: "42%" }}
            height={{ base: "50vh", md: "100%" }}
            minHeight="50vh"
          >
            <Terminal
              submissionFeedback={submissionFeedback}
              submissionResult={submissionResult}
            />
            {/* <Terminal terminalTheme={terminalTheme}>
              <div>
                {submissionResult == Result.COMPILATION_ERROR
                  ? submissionFeedback
                  : ReactHtmlParser(
                      submissionFeedback ? submissionFeedback : "Waiting..."
                    )}
              </div>
            </Terminal> */}
          </Box>
        </Flex>
      </Box>
    </SettingsContext.Provider>
  );
};

// const Terminal = styled.div<{ terminalTheme: string }>`
//   position: relative;
//   height: 100%;
//   width: 100%;
//   background-color: ${({ terminalTheme }) =>
//     terminalTheme == "dark" ? "#323232" : "white"};
//   color: ${({ terminalTheme }) =>
//     terminalTheme == "dark" ? "white" : "#121212"};
//   padding: 12px;
//   margin: 0px;
//   font-size: 13px;
//   font-family: "Source Code Pro", monospace;
//   overflow-y: auto;
//   overflow-x: hidden;
//   word-wrap: break-word;
//   & > div {
//     margin: auto;
//     width: 90%;
//     position: absolute;
//   }
// `;

export default Exercise;
