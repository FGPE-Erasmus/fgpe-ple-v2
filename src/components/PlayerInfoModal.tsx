import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";

const PlayerInfoModal = ({
  isOpen,
  onClose,
  playerInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  playerInfo?: {
    user?: {
      email?: string | null;
    };
    progress?: {
      total?: number;
      progress?: number;
    };
    submissions?: any[];
    validations?: any[];
  };
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Player:{" "}
          {playerInfo &&
            playerInfo.user &&
            playerInfo.user.email &&
            playerInfo.user.email}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlayerInfoModal;
