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
} from "@chakra-ui/react";

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
              console.log([e.target.value]);
              setTestValues([e.target.value]);
            }}
          />
          {testValues.map((item, i) => {
            if (i != 0) {
              return (
                <Textarea
                  key={i}
                  value={testValues[i]}
                  onChange={(e) => {
                    let newTestValues = [...testValues];
                    newTestValues[i] = e.target.value;
                    setTestValues(newTestValues);
                  }}
                />
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
            Add
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
