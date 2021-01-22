import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FindChallenge_programmingLanguages } from "../../generated/FindChallenge";
import { Result } from "../../generated/globalTypes";

import Settings from "./Settings";

const getColorSchemeForSubmissionResult = (submissionResult: string) => {
  if (submissionResult == Result.ACCEPT) {
    return "green";
  }
  if (submissionResult == Result.ASK_FOR_REEVALUATION) {
    return "orange";
  }

  return "red";
};

const EditorMenu = ({
  submissionResult,
  activeLanguage,
  evaluateSubmission,
  validateSubmission,
  isSubmissionFetching,
  setFetchingCount,
  setSubmissionFetching,
  setActiveLanguage,
  programmingLanguages,
}: {
  submissionResult: string | null;
  activeLanguage: FindChallenge_programmingLanguages;
  evaluateSubmission: () => void;
  validateSubmission: () => void;
  isSubmissionFetching: boolean;
  setFetchingCount: React.Dispatch<React.SetStateAction<number>>;
  setSubmissionFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveLanguage: React.Dispatch<
    React.SetStateAction<FindChallenge_programmingLanguages>
  >;
  programmingLanguages: FindChallenge_programmingLanguages[];
}) => {
  const {
    isOpen: isSettingsOpen,
    onOpen: openSettings,
    onClose: closeSettings,
  } = useDisclosure();

  const { colorMode } = useColorMode();

  return (
    <>
      <Settings
        isOpen={isSettingsOpen}
        onOpen={openSettings}
        onClose={closeSettings}
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
            <Center width={1 / 5}>
              <ButtonGroup size="sm" isAttached w="95%" colorScheme="blue">
                <Button
                  onClick={() => {
                    if (isSubmissionFetching) {
                      setSubmissionFetching(false);
                      setFetchingCount(0);
                    } else {
                      validateSubmission();
                    }
                  }}
                  w="95%"
                  isLoading={isSubmissionFetching}
                  loadingText={"Stop"}
                  disabled={false}
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
                >
                  <IconButton
                    colorScheme="yellow"
                    aria-label="Add to friends"
                    icon={<AiOutlineAppstoreAdd fontSize={18} />}
                  />
                </Tooltip>
              </ButtonGroup>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (isSubmissionFetching) {
                    setSubmissionFetching(false);
                    setFetchingCount(0);
                  } else {
                    evaluateSubmission();
                  }
                }}
                w="95%"
                size="sm"
                isLoading={isSubmissionFetching}
                loadingText={"Stop"}
                disabled={false}
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
                Save
              </Button>
            </Center>
            <Center width={1 / 6.5}>
              <Button
                colorScheme="blue"
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
    </>
  );
};

export default EditorMenu;
