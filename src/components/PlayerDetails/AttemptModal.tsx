import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  Box,
  useColorMode,
  Stack,
  Flex,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Skeleton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery_player_submissions,
  getPlayerQuery_player_validations,
} from "../../generated/getPlayerQuery";
import DetailsCard from "../DetailsCard";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CalendarIcon } from "@chakra-ui/icons";
import ReactHtmlParser from "react-html-parser";
import { GET_SUBMISSION_BY_ID } from "../../graphql/getSubmissionById";
import { useLazyQuery } from "@apollo/client";
import { GET_VALIDATION_BY_ID } from "../../graphql/getValidationById";
import {
  getSubmissionByIdQuery,
  getSubmissionByIdQuery_submission,
} from "../../generated/getSubmissionByIdQuery";
import {
  getValidationByIdQuery,
  getValidationByIdQuery_validation,
} from "../../generated/getValidationByIdQuery";
import { useNotifications } from "../Notifications";

dayjs.extend(LocalizedFormat);

const getOutputs = (
  activeAttempt: Partial<getValidationByIdQuery_validation>
) => {
  if (activeAttempt.outputs) {
    return Object.keys(activeAttempt.outputs).map((objectKey, i) => {
      return activeAttempt.outputs[objectKey];
    });
  } else {
    return "";
  }
};

const getData = (data1: any, data2: any) => {
  if (data1) {
    return data1;
  } else {
    return data2;
  }
};

const AttemptModal = ({
  isOpen,
  onClose,
  activeAttempt,
  gameId,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeAttempt?: Partial<getPlayerQuery_player_validations> & {
    isSubmission: boolean;
  };
  gameId: string;
}) => {
  const [
    detailedSubmissionOrValidationData,
    setDetailedSubmissionOrValidationData,
  ] = useState<
    Partial<{
      id: string;
      feedback: string | null;
      program: string | null;
      outputs: any | null;
    }>
  >();

  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { add: addNotification } = useNotifications();

  const [getSubmissionById, { loading: submissionLoading }] =
    useLazyQuery<getSubmissionByIdQuery>(GET_SUBMISSION_BY_ID, {
      onError: () => {
        addNotification({
          status: "error",
          title: t("error.title"),
          description: t("error.description"),
        });
      },
      fetchPolicy: "network-only",
      onCompleted: ({ submission }) => {
        if (submission) {
          console.log("lol");
          setDetailedSubmissionOrValidationData(submission);
        }
      },
    });

  const [getValidationById, { loading: validationLoading }] =
    useLazyQuery<getValidationByIdQuery>(GET_VALIDATION_BY_ID, {
      onError: () => {
        addNotification({
          status: "error",
          title: t("error.title"),
          description: t("error.description"),
        });
      },
      fetchPolicy: "network-only",
      onCompleted: ({ validation }) => {
        if (validation) {
          setDetailedSubmissionOrValidationData(validation);
        }
      },
    });

  useEffect(() => {
    if (activeAttempt) {
      if (activeAttempt.id) {
        if (activeAttempt.isSubmission) {
          console.log("submission", {
            variables: {
              gameId,
              submissionId: activeAttempt.id,
            },
          });
          getSubmissionById({
            variables: {
              gameId,
              submissionId: activeAttempt.id,
            },
          });
        } else {
          console.log("validation");
          getValidationById({
            variables: {
              gameId,
              validationId: activeAttempt.id,
            },
          });
        }
      } else {
        console.log("no id");
      }
    }
  }, [activeAttempt, gameId, getValidationById, getSubmissionById, isOpen]);

  return (
    <Drawer
      onClose={() => {
        setDetailedSubmissionOrValidationData(undefined);
        onClose();
      }}
      isOpen={isOpen}
      size="xl"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {validationLoading || submissionLoading ? (
            <Skeleton height="20px" />
          ) : detailedSubmissionOrValidationData?.outputs ? (
            t("validation")
          ) : (
            t("submission")
          )}
          {/* {activeAttempt?.outputs ? t("validation") : t("submission")} */}
        </DrawerHeader>
        <ModalCloseButton />

        <Skeleton
          isLoaded={!submissionLoading && !validationLoading}
          height="100%"
        >
          <DrawerBody height="100%">
            <Stack
              direction={{ base: "column", lg: "row" }}
              width="100%"
              marginBottom={2}
            >
              {activeAttempt?.exerciseId && (
                <DetailsCard
                  darkerBorder
                  title={t("Exercise")}
                  content={activeAttempt?.exerciseId}
                  noMargins
                />
              )}
              {activeAttempt?.language && (
                <DetailsCard
                  darkerBorder
                  title={t("Language")}
                  content={activeAttempt?.language}
                  noMargins
                />
              )}
              {activeAttempt?.result && (
                <DetailsCard
                  darkerBorder
                  title={t("Result")}
                  content={activeAttempt.result}
                  noMargins
                />
              )}
            </Stack>

            {activeAttempt?.submittedAt && (
              <Flex justifyContent="center" alignItems="center" marginTop={4}>
                <CalendarIcon marginRight={2} />
                <Text fontSize={14}>
                  {t("Submitted at")}{" "}
                  {dayjs(activeAttempt?.submittedAt).format("lll")}
                </Text>
              </Flex>
            )}

            <Flex
              height="calc(100% - 155px)"
              flexDirection={{ base: "column", md: "row" }}
              overflowY={{ base: "scroll", md: "auto" }}
            >
              {detailedSubmissionOrValidationData?.program && (
                <Box
                  width={
                    detailedSubmissionOrValidationData.outputs ? 2 / 3 : "100%"
                  }
                  marginTop={4}
                  marginBottom={4}
                  borderRadius={4}
                  // maxH="40vh"
                  overflowY="auto"
                >
                  <SyntaxHighlighter
                    wrapLines
                    wrapLongLines
                    customStyle={{
                      fontSize: "14px",
                      // minHeight: "200px",
                      height: "100%",
                    }}
                    language={
                      activeAttempt?.language ? activeAttempt.language : "plain"
                    }
                    style={colorMode === "dark" ? atomOneDark : docco}
                  >
                    {detailedSubmissionOrValidationData?.program || "No data"}
                  </SyntaxHighlighter>
                </Box>
              )}

              {detailedSubmissionOrValidationData?.outputs && (
                <Box
                  width={1 / 3}
                  marginTop={4}
                  marginBottom={4}
                  borderRadius={4}
                  marginLeft={2}
                  // height="100%"
                  // maxHeight={"40vh"}
                  overflowY="auto"
                >
                  <SyntaxHighlighter
                    wrapLines
                    wrapLongLines
                    customStyle={{
                      fontSize: "14px",
                      // minHeight: "200px",
                      height: "100%",
                    }}
                    language={
                      activeAttempt?.language ? activeAttempt.language : "plain"
                    }
                    style={colorMode === "dark" ? atomOneDark : docco}
                  >
                    {(detailedSubmissionOrValidationData.feedback
                      ? detailedSubmissionOrValidationData.feedback
                      : "") +
                      getOutputs(detailedSubmissionOrValidationData.outputs)}
                  </SyntaxHighlighter>
                </Box>
              )}
            </Flex>
          </DrawerBody>
        </Skeleton>
      </DrawerContent>
    </Drawer>
  );
};

export default AttemptModal;
