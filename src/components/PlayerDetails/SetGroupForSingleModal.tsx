import { useMutation } from "@apollo/client";
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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPlayerQuery_player_game_groups } from "../../generated/getPlayerQuery";
import { setGroupForMultipleMutation } from "../../generated/setGroupForMultipleMutation";
import { REMOVE_MULTIPLE_FROM_GROUP } from "../../graphql/removeMultipleFromGroup";
import { SET_GROUP_FOR_MULTIPLE } from "../../graphql/setGroupForMultiple";
import { useNotifications } from "../Notifications";

const SetGroupForSingleModal = ({
  isOpen,
  onClose,
  groupsData,
  playerId,
  gameId,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupsData: getPlayerQuery_player_game_groups[];
  playerId: string;
  gameId: string;
  refetch: () => Promise<any>;
}) => {
  const { add: addNotification } = useNotifications();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [
    setGroupForMultiple,
    { data: setGroupData, loading: setGroupLoading },
  ] = useMutation<setGroupForMultipleMutation>(SET_GROUP_FOR_MULTIPLE);

  const [removeMultipleFromGroup] = useMutation(REMOVE_MULTIPLE_FROM_GROUP);

  const setGroup = async () => {
    setLoading(true);
    await setGroupForMultiple({
      variables: {
        playersIds: [playerId],
        groupId,
        gameId,
      },
    });
    await refetch();
    setLoading(false);
    onClose();
  };

  const removeFromGroup = async () => {
    setLoading(true);

    try {
      await removeMultipleFromGroup({
        variables: {
          playersIds: [playerId],
          gameId,
        },
      });
      await refetch();
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.removePlayers.title"),
        description: t("error.removePlayers.description"),
      });
    }

    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Change group")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
          <Button
            isLoading={loading}
            variant="outline"
            mr={3}
            onClick={removeFromGroup}
            disabled={groupsData.length <= 0}
          >
            {t("Remove from the group")}
          </Button>
          <Button
            isLoading={loading}
            disabled={!groupId}
            colorScheme="blue"
            onClick={setGroup}
          >
            {t("Change group")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SetGroupForSingleModal;
