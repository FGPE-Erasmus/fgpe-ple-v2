import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  ModalCloseButton,
  Skeleton,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import DetailsCard from "../../DetailsCard";

import { CalendarIcon } from "@chakra-ui/icons";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  docco,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import { getPlayerValidationsQuery_player_validations } from "../../../generated/getPlayerValidationsQuery";
import { getValidationByIdQuery_validation } from "../../../generated/getValidationByIdQuery";
import { useNotifications } from "../../Notifications";

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

const AttemptModal = ({
  isOpen,
  onClose,
  activeAttempt,
  gameId,
  detailedSubmissionOrValidationData,
  setDetailedSubmissionOrValidationData,
  ref,
  tutorialElementId,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeAttempt?: Partial<getPlayerValidationsQuery_player_validations> & {
    isSubmission: boolean;
  };
  gameId: string;
  tutorialElementId: string;
  detailedSubmissionOrValidationData?:
    | Partial<{
        id: string;
        feedback: string | null;
        program: string | null;
        outputs: any | null;
      }>
    | undefined;
  setDetailedSubmissionOrValidationData: Function;
  ref?: any;
}) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { add: addNotification } = useNotifications();

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
        } else {
          console.log("validation");
        }
      } else {
        console.log("no id");
      }
    }
  }, [activeAttempt, gameId, isOpen]);

  return (
    <Drawer
      onClose={() => {
        // setDetailedSubmissionOrValidationData(undefined);
        onClose();
      }}
      isOpen={isOpen}
      size="xl"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {!detailedSubmissionOrValidationData ? (
            <Skeleton height="20px" />
          ) : detailedSubmissionOrValidationData?.outputs ? (
            t("validation")
          ) : (
            t("submission")
          )}
        </DrawerHeader>
        <ModalCloseButton />
        <Box id={tutorialElementId} maxH={"50vh"}>
          <Skeleton isLoaded={true} height="100%">
            <DrawerBody height="100%" data-cy="attempt-details">
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
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  marginTop={4}
                  ref={ref}
                >
                  <CalendarIcon marginRight={2} />
                  <Text fontSize={14} data-cy="submitted-at">
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
                      detailedSubmissionOrValidationData.outputs
                        ? 2 / 3
                        : "100%"
                    }
                    marginTop={4}
                    marginBottom={4}
                    borderRadius={4}
                    // maxH="40vh"
                    overflowY="auto"
                    data-cy="attempt-content-code"
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
                        activeAttempt?.language
                          ? activeAttempt.language
                          : "plain"
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
                    data-cy="attempt-content"
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
                        activeAttempt?.language
                          ? activeAttempt.language
                          : "plain"
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
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default AttemptModal;
