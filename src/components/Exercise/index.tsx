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

import useHotKeys from "./useHotKeys";

import {
  FindChallenge,
  FindChallenge_challenge_refs,
  FindChallenge_programmingLanguages,
} from "../../generated/FindChallenge";
import Statement, { getStatementLength } from "./Statement";
import { Result } from "../../generated/globalTypes";
import { SettingsContext } from "./SettingsContext";
import Terminal from "./Terminal";
import { getValidationByIdQuery } from "../../generated/getValidationByIdQuery";
import { useHotkeys } from "react-hotkeys-hook";
import { useKeycloak } from "@react-keycloak/web";

const GET_VALIDATION_BY_ID = gql`
  query getValidationByIdQuery($gameId: String!, $validationId: String!) {
    validation(gameId: $gameId, id: $validationId) {
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
      outputs
      userExecutionTimes

      feedback
      submittedAt
      evaluatedAt
      program
      result
    }
  }
`;

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

const MAX_FETCHING_COUNT = 30;

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
  solved,
  setNextUnsolvedExercise,
}: {
  gameId: string;
  exercise: FindChallenge_challenge_refs | null;
  programmingLanguages: FindChallenge_programmingLanguages[];
  challengeRefetch: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<FindChallenge>>;
  solved: boolean;
  setNextUnsolvedExercise: () => void;
}) => {
  const [code, setCode] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(programmingLanguages[0]);
  const { keycloak, initialized } = useKeycloak();

  const [fetchingCount, setFetchingCount] = useState(0);

  const [submissionFeedback, setSubmissionFeedback] = useState("Ready");
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);
  const [validationOutputs, setValidationOutputs] = useState<null | any>(null);

  const [isEvaluationFetching, setEvaluationFetching] = useState(false);
  const [isValidationFetching, setValidationFetching] = useState(false);

  const [evaluationId, setEvaluationId] = useState<null | string>(null);
  const [validationId, setValidationId] = useState<null | string>(null);

  const [editorTheme, setEditorTheme] = useState("light");
  const [terminalTheme, setTerminalTheme] = useState("light");

  const [testValues, setTestValues] = useState<string[]>([""]);

  const exerciseRef = useRef<FindChallenge_challenge_refs | null>(null);
  const activeLanguageRef = useRef<FindChallenge_programmingLanguages>(
    activeLanguage
  );
  const isEvaluationFetchingRef = useRef<boolean>(isEvaluationFetching);
  const isValidationFetchingRef = useRef<boolean>(isValidationFetching);
  const codeRef = useRef<string>(code);

  useEffect(() => {
    isEvaluationFetchingRef.current = isEvaluationFetching;
    isValidationFetchingRef.current = isValidationFetching;
    exerciseRef.current = exercise;
    activeLanguageRef.current = activeLanguage;
    codeRef.current = code;
  });

  useEffect(() => {
    setCode("");
    // setSubmissionResult(null);
    setEvaluationFetching(false);
    setValidationFetching(false);
    setFetchingCount(0);
    // setValidationOutputs(null);

    if (exercise?.id) {
      const lastSubmissionFeedbackUnparsed = localStorage.getItem(
        `${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`
      );
      try {
        if (lastSubmissionFeedbackUnparsed) {
          const parsedLastSubmission = JSON.parse(
            lastSubmissionFeedbackUnparsed
          );
          console.log("GOT", parsedLastSubmission);
          if (parsedLastSubmission.submissionFeedback != undefined) {
            setSubmissionFeedback(parsedLastSubmission.submissionFeedback);
            console.log("setting feedback");
          } else {
            setSubmissionFeedback("Ready");
            console.log("setting feedback - ready");
          }

          if (parsedLastSubmission.submissionResult) {
            setSubmissionResult(parsedLastSubmission.submissionResult);
          } else {
            setSubmissionResult(null);
          }

          if (parsedLastSubmission.validationOutputs) {
            setValidationOutputs(parsedLastSubmission.validationOutputs);
          } else {
            setValidationOutputs(null);
          }
        } else {
          clearPlayground();
        }
      } catch (err) {
        clearPlayground();
      }
    } else {
      clearPlayground();
    }
  }, [exercise]);

  useEffect(() => {
    if (submissionResult == Result.ACCEPT) {
      challengeRefetch();
    }
  }, [submissionResult]);

  // const setSubmissionFeedbackWithLocalStorage = (value: string) => {
  //   if (exercise?.id) {
  //     console.log("saving to localstorage...", value);
  //     console.log(value);
  //     localStorage.setItem(exercise.id, value);
  //   }

  //   setSubmissionFeedback(value);
  // };

  const saveSubmissionDataInLocalStorage = (
    submissionFeedback: string,
    submissionResult: Result,
    validationOutputs?: any
  ) => {
    if (exercise?.id) {
      localStorage.setItem(
        `${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`,
        JSON.stringify({
          submissionFeedback,
          submissionResult,
          validationOutputs,
        })
      );
    }
  };

  // EVALUATION (SUBMIT) POLLING
  useInterval(
    () => {
      if (evaluationError) {
        console.log("Stopping interval", evaluationError);
        setFetchingCount(0);
        setEvaluationFetching(false);
      }

      if (fetchingCount > MAX_FETCHING_COUNT) {
        setFetchingCount(0);
        setEvaluationFetching(false);
      }

      console.log("[POLLING EVALUATION]", evaluationData);

      if (!evaluationData?.submission.result) {
        console.log("[NO EVALUATION DATA]", evaluationData);
        setFetchingCount(fetchingCount + 1);
        getEvaluationById({
          variables: { gameId, submissionId: evaluationId },
        });
      } else {
        console.log("Submission", evaluationData);
        setEvaluationFetching(false);
        setSubmissionFeedback(evaluationData.submission.feedback || "");
        setSubmissionResult(evaluationData.submission.result);

        saveSubmissionDataInLocalStorage(
          evaluationData.submission.feedback || "",
          evaluationData.submission.result
        );
      }
    },
    // Delay in milliseconds or null to stop it
    isEvaluationFetching ? 1000 : null
  );

  // VALIDATION (RUN) POLLING
  useInterval(
    () => {
      if (evaluationError) {
        setFetchingCount(0);
        setValidationFetching(false);
      }

      if (fetchingCount > MAX_FETCHING_COUNT) {
        setFetchingCount(0);
        setValidationFetching(false);
      }

      console.log("[POLLING VALIDATION]", validationData);
      // console.log("validation data", validationData);

      if (!validationData?.validation.result) {
        console.log("[NO VALIDAION DATA]", validationData);
        // console.log("Checking the result...");
        setFetchingCount(fetchingCount + 1);
        getValidationById({
          variables: { gameId, validationId: validationId },
        });
      } else {
        console.log("Validation", validationData);
        setValidationFetching(false);

        if (validationData.validation.result === Result.ACCEPT) {
          setSubmissionResult(null);
        } else {
          setSubmissionResult(validationData.validation.result);
        }

        setSubmissionFeedback(validationData.validation.feedback || "");

        setValidationOutputs(validationData.validation.outputs);

        saveSubmissionDataInLocalStorage(
          validationData.validation.feedback || "",
          validationData.validation.result,
          validationData.validation.outputs
        );

        // setSubmissionResult(validationData.validation.);
      }
    },
    // Delay in milliseconds or null to stop it
    isValidationFetching ? 1000 : null
  );

  const [
    getEvaluationById,
    {
      loading: isEvaluationLoading,
      data: evaluationData,
      error: evaluationError,
    },
  ] = useLazyQuery<getSubmissionByIdQuery>(GET_SUBMISSION_BY_ID, {
    onError(data) {
      console.log("[GET EVALUATION BY ID ERROR]", data);
    },
    onCompleted(data) {
      console.log("[GET EVALUATION BY ID]", data);
    },
    fetchPolicy: "network-only",
  });

  const [
    getValidationById,
    {
      loading: isValidationLoading,
      data: validationData,
      error: validationError,
    },
  ] = useLazyQuery<getValidationByIdQuery>(GET_VALIDATION_BY_ID, {
    onCompleted(data) {
      console.log("[GET VALIDATION BY ID]", data);
    },
    fetchPolicy: "network-only",
  });

  const [evaluateSubmissionMutation] = useMutation(EVALUATE_SUBMISSION, {
    onError(data) {
      console.log("[EVALUATION ERROR]");
    },
    onCompleted(data) {
      const submissionId = data.evaluate.id;
      console.log("[EVALUATE MUTATION DATA]", data);
      console.log("[SUBMISSION ID]", submissionId);
      console.log("QUERY DATA", {
        variables: { gameId, submissionId },
      });
      setEvaluationFetching(true);
      setFetchingCount(0);
      setEvaluationId(submissionId);
      getEvaluationById({
        variables: { gameId, submissionId },
      });
    },
  });

  const [validateSubmissionMutation] = useMutation(VALIDATE_SUBMISSION, {
    onCompleted(data) {
      const validationId = data.validate.id;
      console.log("[VALIDATE MUTATION DATA]", data);
      console.log("[VALIDATION ID]", validationId);
      setValidationFetching(true);
      setFetchingCount(0);
      setValidationId(validationId);
      getValidationById({
        variables: { gameId, validationId },
      });
    },
  });

  const getFileFromCode = () => {
    const blob = new Blob([codeRef.current], { type: "text/plain" });
    const file = new File(
      [blob],
      `Solution.${activeLanguageRef.current.extension}`
    );

    return file;
  };

  const evaluateSubmission = () => {
    clearPlayground();
    // setEvaluationFetching(true);
    // setFetchingCount(0);
    if (isEvaluationFetchingRef.current) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("[EVALUATE SUBMISSION]");

    const file = getFileFromCode();

    evaluateSubmissionMutation({
      variables: { file, gameId, exerciseId: exerciseRef.current?.id },
    });
  };

  const validateSubmission = () => {
    clearPlayground();
    // setValidationFetching(true);
    // setFetchingCount(0);

    if (isValidationFetchingRef.current) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("[VALIDATE SUBMISSION]");

    const file = getFileFromCode();

    validateSubmissionMutation({
      variables: {
        file,
        gameId,
        exerciseId: exerciseRef.current?.id,
        inputs: testValues,
      },
    });
  };

  const clearPlayground = () => {
    setSubmissionResult(null);
    setSubmissionFeedback("Ready");
    setValidationOutputs(null);
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
          solved={solved}
          setNextUnsolvedExercise={setNextUnsolvedExercise}
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
              validateSubmission={validateSubmission}
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
              validationOutputs={validationOutputs}
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
