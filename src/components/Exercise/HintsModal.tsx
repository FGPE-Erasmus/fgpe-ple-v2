import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { playerHintsQuery_playerHints } from "../../generated/playerHintsQuery";
import { rewardReceivedStudentSubscription_rewardReceivedStudent_reward } from "../../generated/rewardReceivedStudentSubscription";

const HintsModal = ({
  isOpen,
  onClose,
  playerHints,
}: {
  isOpen: boolean;
  onClose: () => void;
  playerHints: (
    | playerHintsQuery_playerHints
    | rewardReceivedStudentSubscription_rewardReceivedStudent_reward
  )[];
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Hints")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {playerHints.map((hint, i) => {
            <SingleHint
              key={i}
              title={hint.name}
              description={hint.description}
            />;
          })}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SingleHint = ({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) => {
  return (
    <Box
      border="1px solid"
      borderRadius={4}
      padding={2}
      borderColor="gray.200"
      marginBottom={4}
    >
      <p>
        <b>{title}</b>
      </p>

      {description && (
        <>
          <Divider margin="6px 0px 6px 0px" />
          <p>{description}</p>
        </>
      )}
    </Box>
  );
};

export default HintsModal;
