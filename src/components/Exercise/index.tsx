import React, { useState, useEffect, useRef } from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "@emotion/styled";
import {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  ApolloQueryResult,
  useSubscription,
} from "@apollo/client";
import { getSubmissionByIdQuery } from "../../generated/getSubmissionByIdQuery";
import CodeEditor from "../CodeEditor";
import useInterval from "../../utilities/useInterval";
// import Loading from "./Loading";
import EditorMenu from "./EditorMenu";
import { Flex, Box, useDisclosure } from "@chakra-ui/react";
import { decryptWithAES, encryptWithAES } from "../../utilities/Encryption";

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

import { getPlayerIdQuery } from "../../generated/getPlayerIdQuery";
import { validationSubscription } from "../../generated/validationSubscription";
import { evaluationSubscription } from "../../generated/evaluationSubscription";
import { latestValidationQuery } from "../../generated/latestValidationQuery";
import { languages } from "prismjs";
import { parse } from "graphql";
import { clear } from "console";

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

const VALIDATION_SUBSCRIPTION = gql`
  subscription validationSubscription($gameId: String!) {
    validationProcessedStudent(gameId: $gameId) {
      id
      player {
        id
      }
      exerciseId
      result
      createdAt
      feedback
      outputs
    }
  }
`;

const EVALUATION_SUBSCRIPTION = gql`
  subscription evaluationSubscription($gameId: String!) {
    submissionEvaluatedStudent(gameId: $gameId) {
      id
      player {
        id
      }
      exerciseId
      result
      createdAt
      feedback
    }
  }
`;

const LATEST_VALIDATION = gql`
  query latestValidationQuery($gameId: String!, $exerciseId: String!) {
    latestValidation(gameId: $gameId, exerciseId: $exerciseId) {
      createdAt
      feedback
      result
      outputs
      language
      program
      id
    }
  }
`;

const LATEST_SUBMISSION = gql`
  query latestSubmissionQuery($gameId: String!, $exerciseId: String!) {
    latestSubmission(gameId: $gameId, exerciseId: $exerciseId) {
      createdAt
      feedback
      result
      language
      program
      id
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

const getTerminalFontSize = () => {
  const terminalFontSize = localStorage.getItem("terminalFontSize");
  if (terminalFontSize) {
    return terminalFontSize;
  }
  return "14";
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
  const [
    activeLanguage,
    setActiveLanguage,
  ] = useState<FindChallenge_programmingLanguages>(programmingLanguages[0]);
  const [code, setCode] = useState("");

  const { keycloak } = useKeycloak();

  const [submissionFeedback, setSubmissionFeedback] = useState("Ready");
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);
  const [validationOutputs, setValidationOutputs] = useState<null | any>(null);

  const [
    isWaitingForEvaluationResult,
    setWaitingForEvaluationResult,
  ] = useState(false);
  const [
    isWaitingForValidationResult,
    setWaitingForValidationResult,
  ] = useState(false);

  const [connectionProblem, setConnectionProblem] = useState(false);

  const [evaluationId, setEvaluationId] = useState<null | string>(null);
  const [validationId, setValidationId] = useState<null | string>(null);

  const [editorTheme, setEditorTheme] = useState("light");
  const [terminalTheme, setTerminalTheme] = useState("light");
  const [terminalFontSize, setTerminalFontSize] = useState("18");

  const [testValues, setTestValues] = useState<string[]>([""]);

  const exerciseRef = useRef<FindChallenge_challenge_refs | null>(null);
  const activeLanguageRef = useRef<FindChallenge_programmingLanguages>(
    activeLanguage
  );
  const isEvaluationFetchingRef = useRef<boolean>(isWaitingForEvaluationResult);
  const isValidationFetchingRef = useRef<boolean>(isWaitingForValidationResult);
  const codeRef = useRef<string>(code);
  const [isRestoreAvailable, setRestoreAvailable] = useState(false);

  const reloadCode = () => {
    setCode("");
    clearPlayground();
    saveSubmissionDataInLocalStorage("", null, true, null, "");
  };

  const getCodeSkeleton = () => {
    if (exercise) {
      if (exercise.codeSkeletons) {
        const codeSkeletons = exercise.codeSkeletons;
        for (let i = 0; i < codeSkeletons.length; i++) {
          if (codeSkeletons[i].extension == activeLanguage.extension) {
            setCode(codeSkeletons[i].code || "");
            return codeSkeletons[i].code;
          }
        }
      }
    }

    return "";
  };

  const saveCodeToLocalStorage = (codeToSave: string) => {
    if (exercise && keycloak.profile?.email) {
      const userDataLocalStorage = localStorage.getItem(
        `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`
      );
      if (userDataLocalStorage) {
        const userData = JSON.parse(userDataLocalStorage);
        const encryptedCode = encryptWithAES(
          codeToSave,
          keycloak.profile?.email
        );
        const userDataWithNewCode = {
          ...userData,
          code: encryptedCode,
          language: activeLanguage.name,
        };
        localStorage.setItem(
          `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`,
          JSON.stringify(userDataWithNewCode)
        );
      } else {
        saveSubmissionDataInLocalStorage("", null, true, null, codeToSave);
      }
    }
  };

  const restoreLatestSubmissionOrValidation = async () => {
    const latestValidation = await refetchLastValidation();

    if (!latestValidation.data) {
      return;
    }

    const latestValidationData = latestValidation.data.latestValidation;

    if (!latestValidationData) {
      return;
    }

    setCode(latestValidationData.program || "");

    for (let i = 0; i < programmingLanguages.length; i++) {
      if (programmingLanguages[i].name == latestValidationData.language) {
        setActiveLanguage(programmingLanguages[i]);
      }
    }

    if (latestValidationData.outputs) {
      setValidationOutputs(latestValidationData.outputs);
    } else {
      setValidationOutputs(null);
    }

    if (latestValidationData.feedback) {
      setSubmissionFeedback(latestValidationData.feedback);
    } else {
      setSubmissionFeedback("");
    }

    if (latestValidationData.result) {
      if (latestValidationData.result === Result.ACCEPT) {
        setSubmissionResult(null);
      } else {
        setSubmissionResult(latestValidationData.result);
      }
    } else {
      setSubmissionResult(null);
    }

    saveSubmissionDataInLocalStorage(
      latestValidationData.feedback || "",
      latestValidationData.result,
      true,
      latestValidationData.outputs,
      latestValidationData.program || ""
    );
  };

  useEffect(() => {
    isEvaluationFetchingRef.current = isWaitingForEvaluationResult;
    isValidationFetchingRef.current = isWaitingForValidationResult;
    exerciseRef.current = exercise;
    activeLanguageRef.current = activeLanguage;
    codeRef.current = code;
  });

  useEffect(() => {
    const maxTime = 120;
    const timeoutID = setTimeout(() => {
      if (isValidationFetchingRef.current || isEvaluationFetchingRef.current) {
        setConnectionProblem(true);
      }
    }, 1000 * maxTime);
    return () => clearInterval(timeoutID);
  }, [isWaitingForEvaluationResult, isWaitingForValidationResult]);

  const {
    data: lastValidationData,
    error: lastValidationError,
    loading: lastValidationLoading,
    refetch: refetchLastValidation,
  } = useQuery<latestValidationQuery>(LATEST_VALIDATION, {
    variables: { gameId, exerciseId: exercise?.id },
    skip: exercise ? false : true,
    fetchPolicy: "no-cache",
  });

  const getLastStateFromLocalStorage = (
    lastSubmissionFeedbackUnparsed: any
  ) => {
    try {
      if (lastSubmissionFeedbackUnparsed) {
        const parsedLastSubmission = JSON.parse(lastSubmissionFeedbackUnparsed);
        if (parsedLastSubmission.code) {
          if (keycloak.profile?.email) {
            const encryptedCode = decryptWithAES(
              parsedLastSubmission.code,
              keycloak.profile.email
            );

            setCode(encryptedCode);
          }
        }

        // console.log("GOT", parsedLastSubmission);
        if (parsedLastSubmission.submissionFeedback != undefined) {
          setSubmissionFeedback(parsedLastSubmission.submissionFeedback);
          // console.log("setting feedback");
        } else {
          setSubmissionFeedback("Ready");
          // console.log("setting feedback - ready");
        }

        if (parsedLastSubmission.language) {
          for (let i = 0; i < programmingLanguages.length; i++) {
            if (programmingLanguages[i].name == parsedLastSubmission.language) {
              setActiveLanguage(programmingLanguages[i]);
            }
          }
        }

        if (parsedLastSubmission.submissionResult) {
          if (parsedLastSubmission.isValidation) {
            if (parsedLastSubmission.submissionResult === Result.ACCEPT) {
              setSubmissionResult(null);
            } else {
              setSubmissionResult(parsedLastSubmission.submissionResult);
            }
          } else {
            setSubmissionResult(parsedLastSubmission.submissionResult);
          }
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
  };

  useEffect(() => {
    setCode("");
    // setSubmissionResult(null);
    setWaitingForEvaluationResult(false);
    setWaitingForValidationResult(false);

    if (exercise?.id) {
      const lastSubmissionFeedbackUnparsed = localStorage.getItem(
        `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`
      );
      getLastStateFromLocalStorage(lastSubmissionFeedbackUnparsed);
    } else {
      clearPlayground();
    }
  }, [exercise]);

  useEffect(() => {
    if (submissionResult == Result.ACCEPT) {
      // console.log("Challenge refresh!");
      challengeRefetch();
    }
  }, [submissionResult]);

  const saveSubmissionDataInLocalStorage = (
    submissionFeedback: string,
    submissionResult: Result | null,
    isValidation: boolean,
    validationOutputs?: any,
    codeToSave?: string
  ) => {
    if (exercise?.id) {
      if (keycloak.profile?.email) {
        localStorage.setItem(
          `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise.id}`,
          JSON.stringify({
            code: encryptWithAES(
              typeof codeToSave != "undefined" ? codeToSave : code,
              keycloak.profile.email
            ),
            submissionFeedback,
            submissionResult,
            validationOutputs,
            isValidation,
            time: new Date(),
            language: activeLanguage.name,
          })
        );
      }
    }
  };

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

  const {
    data: subEvaluationData,
    loading: subEvaluationLoading,
    error: subEvaluationError,
  } = useSubscription<evaluationSubscription>(EVALUATION_SUBSCRIPTION, {
    variables: { gameId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (isWaitingForEvaluationResult) {
        if (subscriptionData.data) {
          setRestoreAvailable(true);

          const evaluationData =
            subscriptionData.data.submissionEvaluatedStudent;
          setSubmissionResult(evaluationData.result);
          setSubmissionFeedback(evaluationData.feedback || "");
          setValidationOutputs(null);
          setWaitingForEvaluationResult(false);

          saveSubmissionDataInLocalStorage(
            evaluationData.feedback || "",
            evaluationData.result,
            false,
            null
          );
        }
      }
    },
  });

  const {
    data: subValidationData,
    loading: subValidationLoading,
    error: subValidationError,
  } = useSubscription<validationSubscription>(VALIDATION_SUBSCRIPTION, {
    variables: { gameId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (isWaitingForValidationResult) {
        console.log("Sub data", subscriptionData);

        if (subscriptionData.data) {
          setRestoreAvailable(true);
          const validationData =
            subscriptionData.data.validationProcessedStudent;

          setValidationOutputs(validationData?.outputs);
          setSubmissionFeedback(validationData?.feedback || "");
          setWaitingForValidationResult(false);

          if (validationData.result === Result.ACCEPT) {
            setSubmissionResult(null);
          } else {
            setSubmissionResult(validationData.result);
          }

          saveSubmissionDataInLocalStorage(
            validationData?.feedback || "",
            validationData.result,
            true,
            validationData?.outputs
          );
        }
      }
    },
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
      setWaitingForEvaluationResult(true);

      // setFetchingCount(0);
      setEvaluationId(submissionId);
      getEvaluationById({
        variables: { gameId, submissionId },
      });
    },
  });

  const [validateSubmissionMutation] = useMutation(VALIDATE_SUBMISSION, {
    onCompleted(data) {
      const validationId = data.validate.id;
      // console.log("[VALIDATE MUTATION DATA]", data);
      // console.log("[VALIDATION ID]", validationId);
      setWaitingForValidationResult(true);

      // setFetchingCount(0);
      // setValidationId(validationId);
      // getValidationById({
      //   variables: { gameId, validationId },
      // });
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

    if (isValidationFetchingRef.current) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("[VALIDATE SUBMISSION]");

    const file = getFileFromCode();
    // console.log("INPUTS", testValues);
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
        terminalFontSize: getTerminalFontSize(),
        setTerminalFontSize,
      }}
    >
      {/* {!subValidationLoading && (
        <span>{subValidationData?.validationProcessedStudent.result}</span>
      )} */}
      <Box width={"100%"} height={"100%"} m={0} p={0}>
        <Statement exercise={exercise} />
        <EditorMenu
          reload={reloadCode}
          submissionResult={submissionResult}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          evaluateSubmission={evaluateSubmission}
          validateSubmission={validateSubmission}
          isValidationFetching={isWaitingForValidationResult}
          isEvaluationFetching={isWaitingForEvaluationResult}
          // setFetchingCount={setFetchingCount}
          restore={restoreLatestSubmissionOrValidation}
          setSubmissionFetching={setWaitingForEvaluationResult}
          programmingLanguages={programmingLanguages}
          setValidationFetching={setWaitingForValidationResult}
          testValues={testValues}
          setTestValues={setTestValues}
          solved={solved}
          setNextUnsolvedExercise={setNextUnsolvedExercise}
          connectionError={
            subValidationError || subEvaluationError || connectionProblem
          }
          isRestoreAvailable={
            (isRestoreAvailable || (lastValidationError ? false : true)) &&
            !lastValidationLoading
          }
        />

        <Flex
          height={`calc(100% - ${
            200 + (exercise?.pdf ? 0 : getStatementLength(exercise)) / 5
          }px)`}
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
              code={code == "" ? getCodeSkeleton() : code}
              setCode={(code) => {
                saveCodeToLocalStorage(code);
                setCode(code);
              }}
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
              loading={
                isWaitingForValidationResult || isWaitingForEvaluationResult
              }
            />
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
