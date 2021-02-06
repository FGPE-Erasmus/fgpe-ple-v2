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
} from "@chakra-ui/react";

import React, { useRef } from "react";
import { IoExitOutline } from "react-icons/io5";
import { FindChallenge_programmingLanguages } from "../../generated/FindChallenge";
import { Result } from "../../generated/globalTypes";
// import { useHotkeys } from "react-hotkeys-hook";
import TextareaModal from "./TextareaModal";

import Settings from "./Settings";
import { getColorSchemeForSubmissionResult } from "./helpers/EditorMenu";

const EditorMenu = ({
  submissionResult,
  activeLanguage,
  evaluateSubmission,
  validateSubmission,
  isEvaluationFetching,
  setFetchingCount,
  setSubmissionFetching,
  setActiveLanguage,
  programmingLanguages,
  isValidationFetching,
  setValidationFetching,
  testValues,
  setTestValues,
  solved,
  setNextUnsolvedExercise,
}: {
  submissionResult: string | null;
  activeLanguage: FindChallenge_programmingLanguages;
  evaluateSubmission: () => void;
  validateSubmission: () => void;
  isEvaluationFetching: boolean;
  setFetchingCount: React.Dispatch<React.SetStateAction<number>>;
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
}) => {
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
                    if (isValidationFetching) {
                      setValidationFetching(false);
                      setFetchingCount(0);
                    } else {
                      validateSubmission();
                    }
                  }}
                  w="95%"
                  isLoading={isValidationFetching}
                  loadingText={"Stop"}
                  disabled={isEvaluationFetching}
                  fontSize={{ base: 12, md: 14 }}
                >
                  Run
                </Button>
                <Tooltip
                  label="Add test values"
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
                    disabled={isEvaluationFetching}
                  />
                </Tooltip>
              </ButtonGroup>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (isEvaluationFetching) {
                    setSubmissionFetching(false);
                    setFetchingCount(0);
                  } else {
                    evaluateSubmission();
                  }
                }}
                w="95%"
                size="sm"
                isLoading={isEvaluationFetching}
                loadingText={"Stop"}
                disabled={isValidationFetching}
                fontSize={{ base: 12, md: 14 }}
              >
                Submit
              </Button>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="teal"
                size="sm"
                w="95%"
                disabled
                fontSize={{ base: 12, md: 14 }}
              >
                Reload
              </Button>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="teal"
                size="sm"
                w="95%"
                disabled
                fontSize={{ base: 12, md: 14 }}
              >
                Restore
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
              ) : isValidationFetching || isEvaluationFetching ? (
                <Spinner size="xs" />
              ) : (
                <Badge m={3} colorScheme="green">
                  READY
                </Badge>
              )}
            </Box>
            <Box width={1 / 4} alignItems="center" justifyContent="center">
              <Button
                colorScheme={solved ? "green" : "gray"}
                size="sm"
                w="95%"
                fontSize={{ base: 12, md: 14 }}
                onClick={setNextUnsolvedExercise}
              >
                Next
              </Button>
            </Box>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default EditorMenu;
