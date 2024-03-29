import { useMutation } from "@apollo/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGameByIdQuery_game_groups } from "../../generated/getGameByIdQuery";
import { setGroupForMultipleMutation } from "../../generated/setGroupForMultipleMutation";
import { SET_GROUP_FOR_MULTIPLE } from "../../graphql/setGroupForMultiple";

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
    setGroupForMultiple,
    { data: setGroupData, loading: setGroupLoading },
  ] = useMutation<setGroupForMultipleMutation>(SET_GROUP_FOR_MULTIPLE);

  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  const setGroupLoop = async () => {
    setLoading(true);

    const selectedStudentsIds = selectedStudents.map((student) => student.id);
    await setGroupForMultiple({
      variables: {
        gameId,
        groupId,
        playersIds: selectedStudentsIds,
      },
    });

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
          <Button variant="outline" mr={3} onClick={onClose}>
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
