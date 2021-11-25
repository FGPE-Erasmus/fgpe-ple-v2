import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { getPlayerQuery_player_learningPath } from "../../generated/getPlayerQuery";
import { useTranslation } from "react-i18next";

const ProgressModal = ({
  isOpen,
  onClose,
  learningPaths,
}: {
  isOpen: boolean;
  onClose: () => void;
  learningPaths?: getPlayerQuery_player_learningPath[];
}) => {
  const { t } = useTranslation();

  return (
    <>
      {learningPaths && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("table.progress")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t("Challenges")}</Th>
                    <Th>{t("table.progress")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {learningPaths.map((learningPath, i) => {
                    return (
                      <Tr key={i}>
                        <Td>{learningPath.challenge.name}</Td>
                        <Td>{(learningPath.progress * 100).toFixed(1)}%</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProgressModal;
