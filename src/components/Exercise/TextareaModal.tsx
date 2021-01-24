import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  CloseButton,
  Flex,
  IconButton,
  Box,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

import { AnimatePresence, motion } from "framer-motion";

const TextareaWithButton = ({
  value,
  changeValue,
  remove,
}: {
  value: string;
  changeValue: (value: string) => void;
  remove: () => void;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
      >
        <Flex alignItems="center" marginBottom={2}>
          <Textarea
            value={value}
            onChange={(e) => {
              changeValue(e.target.value);
            }}
            w="90%"
            placeholder="Provide your test values here..."
          />

          <IconButton
            icon={<CloseIcon />}
            aria-label="remove"
            w="10%"
            marginLeft={2}
            float="right"
            variant="outline"
            onClick={remove}
          />
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
};

const TextareaModal = ({
  isOpen,
  onClose,
  testValues,
  setTestValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  testValues: string[];
  setTestValues: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Provide test values</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={testValues[0]}
            onChange={(e) => {
              let newTestValues = [...testValues];
              newTestValues[0] = e.target.value;
              setTestValues(newTestValues);
            }}
            placeholder="Provide your test values here..."
          />
          {testValues.map((item, i) => {
            if (i != 0) {
              return (
                <TextareaWithButton
                  key={i}
                  value={item}
                  changeValue={(value) => {
                    let newTestValues = [...testValues];
                    newTestValues[i] = value;
                    setTestValues(newTestValues);
                  }}
                  remove={() => {
                    let newTestValues = [...testValues];
                    newTestValues.splice(i, 1);

                    setTestValues(newTestValues);
                  }}
                />
                // <Textarea
                //   key={i}
                //   value={testValues[i]}
                //   onChange={(e) => {
                //     let newTestValues = [...testValues];
                //     newTestValues[i] = e.target.value;
                //     setTestValues(newTestValues);
                //   }}
                // />
              );
            }
          })}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            colorScheme="gray"
            onClick={() => setTestValues([...testValues, ""])}
          >
            Add more
          </Button>
          <Button colorScheme="gray" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TextareaModal;
