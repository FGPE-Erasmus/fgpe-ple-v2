import { gql, useMutation } from "@apollo/client";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  Tooltip,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { importGame } from "../generated/importGame";
import { useNotifications } from "./Notifications";
import StartAndEndDateInput from "./StartAndEndDateInput";
import TutorialWizard from "./TutorialWizard";

dayjs.extend(customParseFormat);

const IMPORT_GAME = gql`
  mutation importGame(
    $file: Upload!
    $gameName: String!
    $evaluationEngine: EvaluationEngine!
    $gameDescription: String
    $startDate: Date
    $endDate: Date
    $private: Boolean
  ) {
    importGEdILArchive(
      gameInput: {
        name: $gameName
        description: $gameDescription
        startDate: $startDate
        endDate: $endDate
        evaluationEngine: $evaluationEngine
        private: $private
      }
      file: $file
    ) {
      id
      name
      description
      courseId
      gedilLayerId
      gedilLayerDescription
      startDate
      endDate
      evaluationEngine
    }
  }
`;

export const isDateValid = (date: string) => {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
};

const AddGameModal = ({
  isOpen,
  onOpen,
  onClose,
  refetchGames,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  refetchGames: () => void;
}) => {
  const { add: addNotification } = useNotifications();

  const [isTutorialWizardOpen, setTutorialWizardOpen] = useState(false);
  const tutorialStepName = useRef<HTMLInputElement>();
  const tutorialStepDescription = useRef<HTMLInputElement>();
  const tutorialStepDateStart = useRef<HTMLInputElement>();
  const tutorialStepDateEnd = useRef<HTMLInputElement>();
  const tutorialStepEngine = useRef<HTMLInputElement>();
  const tutorialStepFile = useRef<HTMLInputElement>();
  const tutorialStepPrivateGame = useRef<HTMLInputElement>();
  const tutorialStepAddButton = useRef<HTMLInputElement>();

  const setRefStepName = useCallback((node: any) => {
    tutorialStepName.current = node;
  }, []);

  const setRefStepDescription = useCallback((node: any) => {
    tutorialStepDescription.current = node;
  }, []);

  const setRefStepDateStart = useCallback((node: any) => {
    tutorialStepDateStart.current = node;
  }, []);

  const setRefStepDateEnd = useCallback((node: any) => {
    tutorialStepDateEnd.current = node;
  }, []);

  const setRefStepEngine = useCallback((node: any) => {
    tutorialStepEngine.current = node;
  }, []);

  const setRefStepFile = useCallback((node: any) => {
    tutorialStepFile.current = node;
  }, []);

  const setRefStepPrivateGame = useCallback((node: any) => {
    tutorialStepPrivateGame.current = node;
  }, []);

  const setRefStepAddButton = useCallback((node: any) => {
    tutorialStepAddButton.current = node;
  }, []);

  const { t } = useTranslation();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: [
      "application/zip",
      "application/octet-stream",
      "application/x-zip-compressed",
      "multipart/x-zip",
    ],
    maxFiles: 1,
    onDropRejected: () => {
      addNotification({
        status: "error",
        title: t("addGame.error.fileRejected.title"),
        description: t("addGame.error.fileRejected.description"),
      });
    },
  });

  const [importNewGame, { loading: importGameLoading }] =
    useMutation<importGame>(IMPORT_GAME, {
      onError(data) {
        addNotification({
          status: "error",
          title: t("addGame.error.cannotAddGame.title"),
          description: t("addGame.error.cannotAddGame.description"),
        });
      },
      onCompleted(data) {
        onClose();
        refetchGames();
        addNotification({
          status: "success",
          title: t("addGame.success.title"),
          description: t("addGame.success.description"),
        });
      },
    });

  const { colorMode } = useColorMode();

  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState(false);

  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState(false);

  const [isEndLaterThanStart, setEndLaterThanStart] = useState(true);

  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [evaluationEngine, setEvaluationEngine] = useState("");

  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <TutorialWizard
          isTutorialWizardOpen={isTutorialWizardOpen}
          setTutorialWizardOpen={setTutorialWizardOpen}
          steps={[
            {
              content: `The tutorial will present itself as a series of modals with annotations and prompts on how to progress.`,
            },
            {
              ref: tutorialStepName as any,
              content:
                "You can start with the name of the game that will help everyone identify it. Try to come up with something unique. This step is required and cannot be changed later.",
              canGoNext: gameName !== "",
            },
            {
              ref: tutorialStepDescription as any,
              content:
                "Add a small meaningful description of the game. This step is not required, you can skip it, but you cannot change it later.",
            },
            {
              ref: tutorialStepDateStart as any,
              content: `You can choose when the game will be available for the players. Enter a date in YYYY-MM-DD format.

If you want your game to be always available just skip this step. You can always edit these dates later.`,
            },
            {
              ref: tutorialStepEngine as any,
              content:
                "You need to choose an engine that will evaluate players' code.",
              canGoNext: evaluationEngine !== "",
            },
            {
              ref: tutorialStepFile as any,
              content:
                "Here you need to provide the game package with all required data. You can export the game package in the Authorkit by choosing the GEDiL + MEF format.",
              canGoNext: acceptedFiles.length > 0,
            },
            {
              ref: tutorialStepPrivateGame as any,
              content:
                "You can make your game private. Only invited playres will have access to your game. You can change this later.",
            },
            {
              ref: tutorialStepAddButton as any,
              content: "There's only one thing left to do. Add the game!",
              canGoNext: importGameLoading,
            },
          ]}
        />

        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Add new game")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={1}>
              <FormControl id="name" isRequired ref={setRefStepName}>
                <FormLabel>{t("addGame.name")}</FormLabel>
                <Input
                  type="text"
                  placeholder={t("addGame.namePlaceholder")}
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
              </FormControl>
              <FormControl id="description" ref={setRefStepDescription}>
                <FormLabel>{t("addGame.description")}</FormLabel>
                <Textarea
                  placeholder={t("addGame.descriptionPlaceholder")}
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                />
              </FormControl>

              <div ref={setRefStepDateStart}>
                <StartAndEndDateInput
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setEndDateError={setEndDateError}
                  setStartDateError={setStartDateError}
                  isEndLaterThanStart={isEndLaterThanStart}
                  setEndLaterThanStart={setEndLaterThanStart}
                  startDateError={startDateError}
                  endDateError={endDateError}
                />
              </div>

              <FormControl isRequired marginBottom={2} ref={setRefStepEngine}>
                <FormLabel id="engine">
                  {t("addGame.evaluationEngine")}
                </FormLabel>
                <Select
                  placeholder={t("Select option")}
                  value={evaluationEngine}
                  onChange={(e: any) => {
                    setEvaluationEngine(e.target.value);
                  }}
                >
                  <option value="MOOSHAK">MOOSHAK</option>
                </Select>
              </FormControl>
              {/* <FormControl id="course" isRequired marginBottom={2}>
              <FormLabel>{t("addGame.courseId")}</FormLabel>
              <Input
                type="text"
                placeholder={t("addGame.courseIdPlaceholder")}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              />
            </FormControl> */}

              <DragAndDropField
                bgColor={colorMode === "dark" ? "blue.700" : "blue.100"}
                width="100%"
                justifyContent="center"
                alignItems="center"
                height={50}
                borderRadius={4}
                border={`2px dashed`}
                borderColor={colorMode === "dark" ? "blue.800" : "blue.200"}
                marginBottom={2}
                cursor="pointer"
                userSelect="none"
                _hover={{ bg: colorMode === "dark" ? "blue.600" : "blue.50" }}
                transition="background 0.5s, border 0.5s"
                className={
                  (isDragAccept ? "drop-active" : "") +
                  (isDragReject ? " drop-reject" : "")
                }
              >
                <div
                  {...getRootProps({ className: "dropzone" })}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                  ref={setRefStepFile}
                >
                  <input {...getInputProps()} />
                  <p style={{ textAlign: "center" }}>
                    {isDragReject
                      ? t("addGame.wrongFileType")
                      : acceptedFiles.length > 0
                      ? acceptedFiles.map((file: any) => (
                          <span key={file.path}>{file.path}</span>
                        ))
                      : t("addGame.dragFileOrClick")}
                  </p>
                </div>
              </DragAndDropField>

              <Flex
                justifyContent="space-between"
                width="100%"
                ref={setRefStepPrivateGame}
              >
                <Checkbox
                  isChecked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                >
                  {t("addGame.setPrivate")}
                </Checkbox>
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Flex style={{ gap: 8 }}>
              <IconButton
                onClick={() => setTutorialWizardOpen(true)}
                aria-label="Open tutorial"
                icon={<QuestionOutlineIcon />}
              />

              <Button onClick={onClose} disabled={importGameLoading}>
                {t("Close")}
              </Button>
              <Button
                ref={setRefStepAddButton}
                onClick={() => {
                  setTutorialWizardOpen(false);
                  importNewGame({
                    variables: {
                      file: acceptedFiles[0],
                      gameName: gameName,
                      evaluationEngine: evaluationEngine,
                      gameDescription: gameDescription || undefined,
                      startDate: startDate || undefined,
                      endDate: endDate || undefined,
                      private: isPrivate,
                    },
                  });
                }}
                isLoading={importGameLoading}
                loadingText={t("Adding")}
                colorScheme="blue"
                disabled={
                  !(
                    !importGameLoading &&
                    acceptedFiles.length > 0 &&
                    gameName &&
                    evaluationEngine &&
                    (startDate ? !startDateError : true) &&
                    (endDate ? !endDateError : true) &&
                    (startDate || endDate ? isEndLaterThanStart : true)
                  )
                }
              >
                {t("Add")}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const DragAndDropField = styled(Flex)`
  &.drop-active {
    border: solid;
  }

  &.drop-reject {
    background-color: red;
    cursor: not-allowed;
  }
`;

export default AddGameModal;
