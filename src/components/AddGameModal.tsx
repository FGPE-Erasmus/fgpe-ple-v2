import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
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
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const setRef1 = useCallback(
    (node: any) => {
      tutorialStepDescription.current = node;
      if (isOpen) {
        // always logs the DOM node, or undefined if it's being unmounted
        console.log(node);
      }
    },
    [isOpen]
  );

  const setRef = useCallback(
    (node: any) => {
      tutorialStepName.current = node;
      if (isOpen) {
        // always logs the DOM node, or undefined if it's being unmounted
        console.log(node);
      }
    },
    [isOpen]
  );

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
  // const [courseId, setCourseId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <TutorialWizard
          isTutorialWizardOpen={isOpen}
          setTutorialWizardOpen={setTutorialWizardOpen}
          tutorialSteps={[
            {
              ref: tutorialStepName as any,
              content: "Tutaj wpisujemy name",
              canGoNext: gameName !== "",
            },
            {
              ref: tutorialStepDescription as any,
              content: "Tutaj wpisujemy description",
              canGoNext: gameDescription !== "",
            },
          ]}
        />

        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("Add new game")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={1}>
              <FormControl id="name" isRequired ref={setRef}>
                <FormLabel>{t("addGame.name")}</FormLabel>
                <Input
                  type="text"
                  placeholder={t("addGame.namePlaceholder")}
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
              </FormControl>
              <FormControl id="description" ref={setRef1}>
                <FormLabel>{t("addGame.description")}</FormLabel>
                <Textarea
                  placeholder={t("addGame.descriptionPlaceholder")}
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                />
              </FormControl>

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

              <FormControl isRequired marginBottom={2}>
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

              <Flex justifyContent="space-between" width="100%">
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
            <Button mr={3} onClick={onClose} disabled={importGameLoading}>
              {t("Close")}
            </Button>
            <Button
              onClick={() => {
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
