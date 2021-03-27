import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  CircularProgress,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
  useColorMode,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

import React, { useRef } from "react";
import { IoExitOutline } from "react-icons/io5";
import { BiLink, BiUnlink } from "react-icons/bi";
import { FindChallenge_programmingLanguages } from "../../generated/FindChallenge";
import { Result } from "../../generated/globalTypes";
// import { useHotkeys } from "react-hotkeys-hook";
import TextareaModal from "./TextareaModal";
import { motion, AnimatePresence } from "framer-motion";

import Settings from "./Settings";
import { getColorSchemeForSubmissionResult } from "./helpers/EditorMenu";
import { useTranslation } from "react-i18next";

const EditorMenu = ({
  submissionResult,
  activeLanguage,
  evaluateSubmission,
  validateSubmission,
  isEvaluationFetching: isWaitingForEvaluationResult,

  setSubmissionFetching: setIsWaitingForEvaluationResult,
  setActiveLanguage,
  programmingLanguages,
  isValidationFetching: isWaitingForValidationResult,
  setValidationFetching: setIsWaitingForValidationResult,
  testValues,
  setTestValues,
  solved,
  setNextUnsolvedExercise,
  connectionError,
  restore,
  isRestoreAvailable,
  reload,
}: {
  submissionResult: string | null;
  activeLanguage: FindChallenge_programmingLanguages;
  evaluateSubmission: () => void;
  validateSubmission: () => void;
  isEvaluationFetching: boolean;
  setSubmissionFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setValidationFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveLanguage: React.Dispatch<
    React.SetStateAction<FindChallenge_programmingLanguages>
  >;
  programmingLanguages: FindChallenge_programmingLanguages[];
  isValidationFetching: boolean;
  testValues: string[];
  setTestValues: React.Dispatch<React.SetStateAction<string[]>>;
  solved: boolean;
  setNextUnsolvedExercise: () => void;
  connectionError: any;
  restore: () => void;
  reload: () => void;
  isRestoreAvailable: boolean;
}) => {
  const { t } = useTranslation();

  const {
    isOpen: isSettingsOpen,
    onOpen: openSettings,
    onClose: closeSettings,
  } = useDisclosure();

  const {
    isOpen: isTextareaModalOpen,
    onOpen: openTextareaModal,
    onClose: closeTextareaModal,
  } = useDisclosure();

  const { colorMode } = useColorMode();
  // useHotkeys("ctrl+\\", evaluateSubmission);

  return (
    <>
      <Settings
        isOpen={isSettingsOpen}
        onOpen={openSettings}
        onClose={closeSettings}
      />
      <TextareaModal
        isOpen={isTextareaModalOpen}
        onClose={closeTextareaModal}
        testValues={testValues}
        setTestValues={setTestValues}
      />
      <Flex
        height={{ base: 100, md: 50 }}
        minHeight={50}
        backgroundColor={colorMode == "dark" ? "#1c232f" : "gray.50"}
        alignItems="center"
        p={2}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box
          width={{ base: "100%", md: 7 / 12 }}
          height={{ base: "50%", md: "auto" }}
        >
          <Flex width={"100%"} height={"100%"}>
            <Center width={(1 / 6) * 1.35}>
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
            <Center width={1 / 5}>
              <ButtonGroup size="sm" isAttached w="95%" colorScheme="blue">
                <Button
                  onClick={() => {
                    if (isWaitingForValidationResult) {
                      setIsWaitingForValidationResult(false);
                    } else {
                      validateSubmission();
                    }
                  }}
                  w="95%"
                  isLoading={isWaitingForValidationResult}
                  // loadingText={"Stop"}
                  disabled={
                    isWaitingForEvaluationResult || isWaitingForValidationResult
                  }
                  fontSize={{ base: 12, md: 14 }}
                >
                  {t("playground.menu.run")}
                </Button>
                <Tooltip
                  label={t("playground.menu.addTestValues")}
                  aria-label="A tooltip"
                  bg="gray.300"
                  color="black"
                  hasArrow
                  openDelay={500}
                  visibility={isTextareaModalOpen ? "hidden" : "initial"}
                >
                  <IconButton
                    color={colorMode == "dark" ? "black" : "white"}
                    bgColor={colorMode == "dark" ? "gray.500" : "gray.800"}
                    onClick={openTextareaModal}
                    aria-label="Add to friends"
                    icon={<IoExitOutline fontSize={18} />}
                    disabled={
                      isWaitingForEvaluationResult ||
                      isWaitingForValidationResult
                    }
                  />
                </Tooltip>
              </ButtonGroup>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (isWaitingForEvaluationResult) {
                    setIsWaitingForEvaluationResult(false);
                  } else {
                    evaluateSubmission();
                  }
                }}
                w="95%"
                size="sm"
                isLoading={isWaitingForEvaluationResult}
                // loadingText={"Stop"}
                disabled={
                  isWaitingForEvaluationResult || isWaitingForValidationResult
                }
                fontSize={{ base: 12, md: 14 }}
              >
                {t("playground.menu.submit")}
              </Button>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="teal"
                size="sm"
                w="95%"
                fontSize={{ base: 12, md: 14 }}
                onClick={reload}
              >
                {t("playground.menu.reload")}
              </Button>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="teal"
                size="sm"
                w="95%"
                fontSize={{ base: 12, md: 14 }}
                onClick={restore}
                disabled={!isRestoreAvailable}
              >
                {t("playground.menu.restore")}
              </Button>
            </Center>
            <Center width={1 / 6 / 2}>
              <IconButton
                onClick={openSettings}
                size="sm"
                w="95%"
                aria-label="Settings"
                icon={<SettingsIcon />}
                variant="outline"
              />
            </Center>
          </Flex>
        </Box>
        <Center
          width={{ base: "100%", md: 5 / 12 }}
          height={{ base: "50%", md: "auto" }}
        >
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Box width={3 / 4} textAlign="left">
              {t("playground.menu.status.status")}:
              {/* <div style={{ display: "inline-block", width: 50 }}>
                <AnimatePresence>
                  {(isValidationFetching || isEvaluationFetching) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ display: "inline-block", position: "absolute" }}
                    >
                      <Spinner size="xs" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {submissionResult ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    <Badge
                      m={1}
                      colorScheme={getColorSchemeForSubmissionResult(
                        submissionResult
                      )}
                    >
                      {submissionResult}
                    </Badge>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "inline-block", position: "absolute" }}
                  >
                    <Badge m={1} colorScheme="green">
                      READY
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence> */}
              {submissionResult ? (
                <Badge
                  m={1}
                  colorScheme={getColorSchemeForSubmissionResult(
                    submissionResult
                  )}
                >
                  {connectionError
                    ? t("playground.menu.status.CONNECTION_PROBLEM")
                    : t(`playground.menu.status.${submissionResult}`)}
                </Badge>
              ) : isWaitingForValidationResult ||
                isWaitingForEvaluationResult ? (
                <Spinner marginRight={3} marginLeft={3} size="xs" />
              ) : (
                <Badge m={1} colorScheme={connectionError ? "red" : "green"}>
                  {connectionError
                    ? t("playground.menu.status.CONNECTION_PROBLEM")
                    : t("playground.menu.status.READY")}
                </Badge>
              )}
              <Tooltip
                label={
                  connectionError
                    ? t("playground.menu.connection.error")
                    : t("playground.menu.connection.success")
                }
                aria-label="A tooltip"
                bg="gray.300"
                color="black"
                hasArrow
              >
                <Badge
                  colorScheme={connectionError ? "red" : "green"}
                  variant="solid"
                >
                  {connectionError ? (
                    <BiUnlink fontSize={18} />
                  ) : (
                    <BiLink fontSize={18} />
                  )}
                </Badge>
              </Tooltip>
            </Box>
            <Box width={1 / 4} alignItems="center" justifyContent="center">
              <Button
                colorScheme={solved ? "green" : "gray"}
                size="sm"
                w="95%"
                fontSize={{ base: 12, md: 14 }}
                onClick={setNextUnsolvedExercise}
              >
                {t("playground.menu.next")}
              </Button>
            </Box>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default EditorMenu;
