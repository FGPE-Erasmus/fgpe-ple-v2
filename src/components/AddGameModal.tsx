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

const IMPORT_GAME = gql`
  mutation importGame(
    $file: Upload!
    $gameName: String!
    $courseId: String!
    $evaluationEngine: String!
    $gameDescription: String
    $startDate: String
    $endDate: String
  ) {
    importGEdILArchive(
      gameInput: {
        name: $gameName
        description: $gameDescription
        startDate: $startDate
        endDate: $endDate
        evaluationEngine: $evaluationEngine
        courseId: $courseId
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
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    fileRejections,
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
  });

  const [
    importNewGame,
    { loading: importGameLoading, error: importGameError },
  ] = useMutation<importGame>(IMPORT_GAME, {
    onError(data) {
      console.log("[IMPORT ERROR]", data);
    },
    onCompleted(data) {},
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
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Awesome game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description of your game"
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
              />
            </FormControl>

            <Flex>
              <FormControl paddingRight={1}>
                <FormLabel id="start">Start date</FormLabel>
                <Input
                  value={startDate || ""}
                  type="text"
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => setStartDateRegex(e.target.value)}
                />
              </FormControl>

              <FormControl paddingLeft={1}>
                <FormLabel id="start">End date</FormLabel>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel id="start">Evaluation engine</FormLabel>
              <Select
                placeholder="Select option"
                value={evaluationEngine}
                onChange={(e: any) => {
                  setEvaluationEngine(e.target.value);
                }}
              >
                <option value="MOOSHAK">MOOSHAK</option>
              </Select>
            </FormControl>
            <FormControl id="name" isRequired marginBottom={2}>
              <FormLabel>Course ID</FormLabel>
              <Input
                type="text"
                placeholder="Unique course id"
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
                    ? "Wrong file type"
                    : acceptedFiles.length > 0
                    ? acceptedFiles.map((file: any) => (
                        <span key={file.path}>{file.path}</span>
                      ))
                    : "Drag your file here, or click for file selection dialog"}
                </p>
              </div>
            </DragAndDropField>

            <Flex justifyContent="space-between" width="100%">
              <Checkbox
                isChecked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              >
                Set private
              </Checkbox>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} disabled={importGameLoading}>
            Close
          </Button>
          <Button
            onClick={() => {
              importNewGame({
                variables: {
                  file: acceptedFiles[0],
                  gameName,
                  courseId,
                  evaluationEngine,
                  gameDescription,
                  startDate,
                  endDate,
                },
              });
            }}
            isLoading={importGameLoading}
            loadingText="Adding"
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
            Add
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
