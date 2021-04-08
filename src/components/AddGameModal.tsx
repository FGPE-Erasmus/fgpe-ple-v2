import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  Checkbox,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
  ApolloQueryResult,
  useSubscription,
} from "@apollo/client";
import { useTranslation } from "react-i18next";
import { importGame } from "../generated/importGame";
import { useNotifications } from "./Notifications";

const IMPORT_GAME = gql`
  mutation importGame(
    $file: Upload!
    $gameName: String!
    $courseId: String!
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
        courseId: $courseId
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

  const [
    importNewGame,
    { loading: importGameLoading, error: importGameError },
  ] = useMutation<importGame>(IMPORT_GAME, {
    onError(data) {
      console.log("[IMPORT ERROR]", data);

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
  const [endDate, setEndDate] = useState("");

  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [evaluationEngine, setEvaluationEngine] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const setStartDateRegex = (value: string) => {
    if (value == "") {
      setStartDate("");
    }

    if (value.match(new RegExp(/^-?(\d+-?)+$/gm)) != null) {
      setStartDate(value);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Add new game")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={1}>
            <FormControl id="name" isRequired>
              <FormLabel>{t("addGame.name")}</FormLabel>
              <Input
                type="text"
                placeholder={t("addGame.namePlaceholder")}
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>{t("addGame.description")}</FormLabel>
              <Textarea
                placeholder={t("addGame.descriptionPlaceholder")}
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
              />
            </FormControl>

            <Flex>
              <FormControl paddingRight={1}>
                <FormLabel id="start">{t("addGame.startDate")}</FormLabel>
                <Input
                  value={startDate || ""}
                  type="text"
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => setStartDateRegex(e.target.value)}
                />
              </FormControl>

              <FormControl paddingLeft={1}>
                add validation
                <FormLabel id="end">{t("addGame.endDate")}</FormLabel>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel id="engine">{t("addGame.evaluationEngine")}</FormLabel>
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
            <FormControl id="course" isRequired marginBottom={2}>
              <FormLabel>{t("addGame.courseId")}</FormLabel>
              <Input
                type="text"
                placeholder={t("addGame.courseIdPlaceholder")}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              />
            </FormControl>

            <DragAndDropField
              bgColor={colorMode == "dark" ? "blue.700" : "blue.100"}
              width="100%"
              justifyContent="center"
              alignItems="center"
              height={50}
              borderRadius={4}
              border={`2px dashed`}
              borderColor={colorMode == "dark" ? "blue.800" : "blue.200"}
              marginBottom={2}
              cursor="pointer"
              userSelect="none"
              _hover={{ bg: colorMode == "dark" ? "blue.600" : "blue.50" }}
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
                  courseId: courseId,
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
                courseId
              )
            }
          >
            {t("Add")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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
