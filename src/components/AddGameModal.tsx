import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import { useTranslation } from "react-i18next";

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
  } = useDropzone({
    accept: [
      "application/zip",
      "application/octet-stream",
      "application/x-zip-compressed",
      "multipart/x-zip",
    ],
    maxFiles: 1,
  });

  const [startDate, setStartDate] = useState<string | null>(null);

  const setStartDateRegex = (value: string) => {
    if (value == "") {
      setStartDate(null);
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
              <Input type="text" placeholder="Awesome game name" />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Description of your game" />
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
                <Input type="text" placeholder="YYYY-MM-DD" />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel id="start">Evaluation engine</FormLabel>
              <Select placeholder="Select option">
                <option value="MOOSHAK">MOOSHAK</option>
              </Select>
            </FormControl>
            <FormControl id="name" isRequired>
              <FormLabel>Course ID</FormLabel>
              <Input type="text" placeholder="Unique course id" />
            </FormControl>

            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag file here or click to choose</p>
            </div>

            {acceptedFiles.map((file: any) => (
              <li key={file.path}>
                {file.path} - {file.size} bytes
              </li>
            ))}

            <Flex justifyContent="space-between" width="100%">
              <Checkbox>Set private</Checkbox>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" disabled>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddGameModal;
