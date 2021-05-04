import { gql, useMutation } from "@apollo/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGameByIdQuery_game_groups } from "../../generated/getGameByIdQuery";
import { getGroupsQuery } from "../../generated/getGroupsQuery";

const SET_GROUP = gql`
  mutation setGroupMutation(
    $gameId: String!
    $groupId: String!
    $playerId: String!
  ) {
    setGroup(gameId: $gameId, groupId: $groupId, playerId: $playerId) {
      id
    }
  }
`;

const SetGroupModal = ({
  isOpen,
  onClose,
  gameId,
  groupsData,
  selectedStudentsRef,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  groupsData: getGameByIdQuery_game_groups[];
  selectedStudentsRef: any;
  refetch: () => Promise<any>;
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [
    setGroup,
    { data: setGroupData, loading: setGroupLoading },
  ] = useMutation(SET_GROUP);

  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const setGroupLoop = async () => {
    setLoading(true);
    for (let i = 0; i < selectedStudents.length; i++) {
      await setGroup({
        variables: {
          gameId,
          groupId,
          playerId: selectedStudents[i].id,
        },
      });
      // selectedStudents[i];
    }
    await refetch();
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    setSelectedStudents(selectedStudentsRef.current);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Set group")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {t("youveChosenAmountStudents", {
            amount: selectedStudents.length,
          })}
          <Select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder={t("placeholders.chooseGroup")}
          >
            {groupsData.map((group, i) => {
              return (
                <option value={group.id} key={i}>
                  {group.displayName} ({group.name})
                </option>
              );
            })}
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button varianet="outline" mr={3} onClick={onClose}>
            {t("Close")}
          </Button>
          <Button
            colorScheme="blue"
            onClick={setGroupLoop}
            disabled={loading || !groupId}
            isLoading={loading}
          >
            {t("Set")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SetGroupModal;
