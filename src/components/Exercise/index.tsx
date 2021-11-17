import {
  ApolloQueryResult,
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { Box, Flex } from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import React, { useEffect, useRef, useState } from "react";
import { evaluationSubscription } from "../../generated/evaluationSubscription";
import {
  FindChallenge,
  FindChallenge_myChallengeStatus_refs,
  FindChallenge_programmingLanguages,
} from "../../generated/FindChallenge";
import { getSubmissionByIdQuery } from "../../generated/getSubmissionByIdQuery";
import { getValidationByIdQuery } from "../../generated/getValidationByIdQuery";
import { GET_SUBMISSION_BY_ID } from "../../graphql/getSubmissionById";
import { GET_VALIDATION_BY_ID } from "../../graphql/getValidationById";

import { Result } from "../../generated/globalTypes";
import { latestValidationQuery } from "../../generated/latestValidationQuery";
import { rewardReceivedStudentSubscription_rewardReceivedStudent_reward } from "../../generated/rewardReceivedStudentSubscription";
import { validationSubscription } from "../../generated/validationSubscription";
import { decryptWithAES, encryptWithAES } from "../../utilities/Encryption";
import CodeEditor from "../CodeEditor";
// import Loading from "./Loading";
import EditorMenu from "./EditorMenu";
import EditorSwitcher from "./helpers/EditorSwitcher";
import getEditor from "./helpers/EditorSwitcher";
import Hints from "./Hints";
import { SettingsContext } from "./SettingsContext";
import Statement, { getStatementLength } from "./Statement";
import Terminal from "./Terminal";
import { getDefaultProgrammingLangOrFirstFromArray } from "./helpers/defaultProgrammingLanguage";

const isEditorKindSpotBug = (
  exercise?: FindChallenge_myChallengeStatus_refs | null
) => {
  if (!exercise) {
    return false;
  }

  if (exercise?.activity?.editorKind === "SPOT_BUG") {
    return true;
  }

  return false;
};

// const GET_VALIDATION_BY_ID = gql`
//   query getValidationByIdQuery($gameId: String!, $validationId: String!) {
//     validation(gameId: $gameId, id: $validationId) {
//       id
//       game {
//         id
//       }
//       player {
//         id
//       }
//       exerciseId
//       evaluationEngine
//       evaluationEngineId
//       language
//       metrics
//       outputs
//       userExecutionTimes

//       feedback
//       submittedAt
//       evaluatedAt
//       program
//       result
//     }
//   }
// `;

// const GET_SUBMISSION_BY_ID = gql`
//   query getSubmissionByIdQuery($gameId: String!, $submissionId: String!) {
//     submission(gameId: $gameId, id: $submissionId) {
//       id
//       game {
//         id
//       }
//       player {
//         id
//       }
//       exerciseId
//       evaluationEngine
//       evaluationEngineId
//       language
//       metrics
//       result
//       feedback
//       submittedAt
//       evaluatedAt
//       program
//     }
//   }
// `;

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
  challengeId,
  hints,
  setSideMenuOpen,
}: {
  setSideMenuOpen: () => void;
  gameId: string;
  exercise: FindChallenge_myChallengeStatus_refs | null;
  programmingLanguages: FindChallenge_programmingLanguages[];
  challengeRefetch: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<FindChallenge>>;
  solved: boolean;
  setNextUnsolvedExercise: () => void;
  challengeId: string;
  hints: rewardReceivedStudentSubscription_rewardReceivedStudent_reward[];
}) => {
  const [lastEvaluationOrSubmissionId, setLastEvaluationOrSubmissionId] =
    useState<null | string>(null);

  const [activeLanguage, setActiveLanguage] =
    useState<FindChallenge_programmingLanguages>(
      getDefaultProgrammingLangOrFirstFromArray(programmingLanguages, gameId)
    );
  const [code, setCode] = useState("");

  const { keycloak } = useKeycloak();

  const [submissionFeedback, setSubmissionFeedback] = useState("Ready");
  const [submissionResult, setSubmissionResult] = useState<Result | null>(null);
  const [validationOutputs, setValidationOutputs] = useState<null | any>(null);

  const [isWaitingForEvaluationResult, setWaitingForEvaluationResult] =
    useState(false);
  const [isWaitingForValidationResult, setWaitingForValidationResult] =
    useState(false);

  const [connectionProblem, setConnectionProblem] = useState(false);

  const [evaluationId, setEvaluationId] = useState<null | string>(null);
  const [validationId, setValidationId] = useState<null | string>(null);

  const [editorTheme, setEditorTheme] = useState("light");
  const [terminalTheme, setTerminalTheme] = useState("light");
  const [terminalFontSize, setTerminalFontSize] = useState("18");

  const [testValues, setTestValues] = useState<string[]>([""]);

  const exerciseRef = useRef<FindChallenge_myChallengeStatus_refs | null>(null);
  const activeLanguageRef =
    useRef<FindChallenge_programmingLanguages>(activeLanguage);
  const isEvaluationFetchingRef = useRef<boolean>(isWaitingForEvaluationResult);
  const isValidationFetchingRef = useRef<boolean>(isWaitingForValidationResult);
  const codeRef = useRef<string>(code);
  const [isRestoreAvailable, setRestoreAvailable] = useState(false);

  const reloadCode = () => {
    setCode("");
    clearPlayground();
    saveSubmissionDataInLocalStorage("", null, true, null, "");
  };

  const getCodeSkeleton = (dontSetCode?: boolean, getArray?: boolean) => {
    if (exercise) {
      if (exercise?.activity?.codeSkeletons) {
        // console.log("CODE SKELETONS", exercise?.activity?.codeSkeletons);
        const codeSkeletons = exercise?.activity?.codeSkeletons;
        let allCodeSkeletonsForActiveLang: string[] = [];
        for (let i = 0; i < codeSkeletons.length; i++) {
          if (codeSkeletons[i].extension === activeLanguage.extension) {
            if (!dontSetCode) {
              setCode(codeSkeletons[i].code || "");
            }

            if (!getArray) {
              return codeSkeletons[i].code;
            } else {
              allCodeSkeletonsForActiveLang.push(codeSkeletons[i].code || "");
            }
          }
        }
        if (getArray) {
          return allCodeSkeletonsForActiveLang;
        }
      }
    }

    return "";
  };

  const saveCodeToLocalStorage = (codeToSave: string) => {
    if (exercise && keycloak.profile?.email) {
      const userDataLocalStorage = localStorage.getItem(
        `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise?.activity?.id}`
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
          `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise?.activity?.id}`,
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
      if (programmingLanguages[i].name === latestValidationData.language) {
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
    variables: { gameId, exerciseId: exercise?.activity?.id },
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
        if (parsedLastSubmission.submissionFeedback !== undefined) {
          setSubmissionFeedback(parsedLastSubmission.submissionFeedback);
          // console.log("setting feedback");
        } else {
          setSubmissionFeedback("Ready");
          // console.log("setting feedback - ready");
        }

        if (parsedLastSubmission.language) {
          for (let i = 0; i < programmingLanguages.length; i++) {
            if (
              programmingLanguages[i].name === parsedLastSubmission.language
            ) {
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

    if (exercise?.activity?.id) {
      const lastSubmissionFeedbackUnparsed = localStorage.getItem(
        `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise?.activity?.id}`
      );
      getLastStateFromLocalStorage(lastSubmissionFeedbackUnparsed);
    } else {
      clearPlayground();
    }
  }, [exercise]);

  useEffect(() => {
    if (submissionResult === Result.ACCEPT) {
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
    if (exercise?.activity?.id) {
      if (keycloak.profile?.email) {
        localStorage.setItem(
          `FGPE_${keycloak.profile?.username}_game_${gameId}_chall_${exercise?.activity?.id}`,
          JSON.stringify({
            code: encryptWithAES(
              typeof codeToSave !== "undefined" ? codeToSave : code,
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

  const [getSubmissionById] = useLazyQuery<getSubmissionByIdQuery>(
    GET_SUBMISSION_BY_ID,
    {
      onError(data) {
        console.log("[GET SUBMISSION BY ID ERROR]", data);
      },
      onCompleted(data) {
        console.log("[GET SUBMISSION BY ID]", data);
        if (
          data.submission.id == lastEvaluationOrSubmissionId &&
          lastEvaluationOrSubmissionId
        ) {
          console.log("[SUBMISSION] Already processed");
          setWaitingForEvaluationResult(false);
        }
      },
      fetchPolicy: "network-only",
    }
  );

  const { error: subEvaluationError } = useSubscription<evaluationSubscription>(
    EVALUATION_SUBSCRIPTION,
    {
      variables: { gameId },
      onSubscriptionData: ({ subscriptionData }) => {
        console.log(
          "[SUB] EVALUATION",
          subscriptionData.data?.submissionEvaluatedStudent.id
        );
        const newSubscriptionId =
          subscriptionData.data?.submissionEvaluatedStudent.id;
        setLastEvaluationOrSubmissionId(newSubscriptionId || null);

        if (
          lastEvaluationOrSubmissionId == newSubscriptionId &&
          newSubscriptionId
        ) {
          return;
        }

        // if (isWaitingForEvaluationResult) {
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
        // }
      },
    }
  );

  const { error: subValidationError } = useSubscription<validationSubscription>(
    VALIDATION_SUBSCRIPTION,
    {
      variables: { gameId },
      onSubscriptionData: ({ subscriptionData }) => {
        const newValidationId =
          subscriptionData.data?.validationProcessedStudent.id;
        setLastEvaluationOrSubmissionId(newValidationId || null);

        if (
          lastEvaluationOrSubmissionId == newValidationId &&
          newValidationId
        ) {
          return;
        }

        // if (isWaitingForValidationResult) {
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
        // }
      },
    }
  );

  const [getValidationById] = useLazyQuery<getValidationByIdQuery>(
    GET_VALIDATION_BY_ID,
    {
      onCompleted(data) {
        console.log("[GET VALIDATION BY ID]", data);
      },
      fetchPolicy: "network-only",
    }
  );

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

      // if (
      //   submissionId == lastEvaluationOrSubmissionId &&
      //   lastEvaluationOrSubmissionId
      // ) {
      //   console.log("[EVALUATION] Already processed");
      //   setWaitingForEvaluationResult(false);
      // }

      // setFetchingCount(0);
      setEvaluationId(submissionId);
      getSubmissionById({
        variables: { gameId, submissionId },
      });
    },
  });

  const [validateSubmissionMutation] = useMutation(VALIDATE_SUBMISSION, {
    onCompleted(data) {
      const validationId = data.validate.id;
      // console.log("[VALIDATE MUTATION DATA]", data);
      // console.log("[VALIDATION ID]", validationId);
      if (
        validationId == lastEvaluationOrSubmissionId &&
        lastEvaluationOrSubmissionId
      ) {
        console.log("[VALIDATION] Already processed");
        setWaitingForEvaluationResult(false);
      }

      // setFetchingCount(0);
      // setValidationId(validationId);
      // getValidationById({
      //   variables: { gameId, validationId },
      // });
    },
  });

  const getFileFromCode = (isSpotBugMode?: boolean) => {
    const blob = new Blob([codeRef.current], { type: "text/plain" });
    const file = new File(
      [blob],
      `Solution.${isSpotBugMode ? "txt" : activeLanguageRef.current.extension}`
    );

    return file;
  };

  const evaluateSubmission = (isSpotBugMode?: boolean) => {
    clearPlayground();
    // setEvaluationFetching(true);
    // setFetchingCount(0);
    if (isEvaluationFetchingRef.current) {
      return;
    }
    if (!exerciseRef.current) {
      return;
    } else console.log("[EVALUATE SUBMISSION]");

    const file = getFileFromCode(isSpotBugMode);

    evaluateSubmissionMutation({
      variables: {
        file,
        gameId,
        exerciseId: exerciseRef.current?.activity?.id,
      },
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

    setWaitingForValidationResult(true);

    validateSubmissionMutation({
      variables: {
        file,
        gameId,
        exerciseId: exerciseRef.current?.activity?.id,
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
        <Box position="relative">
          <Statement exercise={exercise} gameId={gameId} />
          <Hints challengeId={challengeId} gameId={gameId} hints={hints} />
        </Box>

        <EditorMenu
          gameId={gameId}
          setSideMenuOpen={setSideMenuOpen}
          editorKind={exercise?.activity?.editorKind}
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
            200 +
              (exercise?.activity?.pdf ? 0 : getStatementLength(exercise)) / 5 >
            250
              ? 300
              : 200 +
                (exercise?.activity?.pdf ? 0 : getStatementLength(exercise)) / 5
          }px)`}
          minHeight={500}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box
            width={{
              base: "99%",
              md: isEditorKindSpotBug(exercise) ? "100%" : "58%",
            }}
            height={{ base: "50vh", md: "100%" }}
            minHeight="50vh"
            p={0}
            m={0}
          >
            {
              <EditorSwitcher
                editorKind={exercise?.activity?.editorKind}
                language={activeLanguage}
                code={code === "" ? getCodeSkeleton() : code}
                codeSkeletons={getCodeSkeleton(true, true) || ""}
                setCode={(code) => {
                  saveCodeToLocalStorage(code);
                  setCode(code);
                }}
                evaluateSubmission={evaluateSubmission}
                validateSubmission={validateSubmission}
              />
            }
            {/* <CodeEditor
              language={activeLanguage}
              code={code === "" ? getCodeSkeleton() : code}
              setCode={(code) => {
                saveCodeToLocalStorage(code);
                setCode(code);
              }}
              evaluateSubmission={evaluateSubmission}
              validateSubmission={validateSubmission}
            /> */}
          </Box>
          {!isEditorKindSpotBug(exercise) && (
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
          )}
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
//     terminalTheme === "dark" ? "#323232" : "white"};
//   color: ${({ terminalTheme }) =>
//     terminalTheme === "dark" ? "white" : "#121212"};
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
