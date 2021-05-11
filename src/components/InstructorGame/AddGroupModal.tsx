import { gql, useMutation } from "@apollo/client";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../Notifications";

const ADD_GROUP = gql`
  mutation addGroupMutation(
    $gameId: String!
    $groupName: String!
    $groupDisplayName: String!
  ) {
    saveGroup(
      gameId: $gameId
      groupInput: { name: $groupName, displayName: $groupDisplayName }
    ) {
      id
      name
      displayName
    }
  }
`;

const AddGroupModal = ({
  isOpen,
  onClose,
  gameId,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
}) => {
  const { add: addNotification } = useNotifications();

  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [addNewGroup, { data: addGroupData, loading: addGroupLoading }] =
    useMutation(ADD_GROUP);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Add new group")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={1}>
            <FormControl id="name" isRequired>
              <FormLabel>{t("Name")}</FormLabel>
              <Input
                placeholder={t("placeholders.groupName")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>

            <FormControl id="name" isRequired>
              <FormLabel>{t("Display name")}</FormLabel>
              <Input
                placeholder={t("placeholders.displayGroupName")}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="outline">
            {t("Close")}
          </Button>
          <Button
            colorScheme="blue"
            isLoading={addGroupLoading}
            disabled={!displayName || !name || addGroupLoading}
            onClick={async () => {
              try {
                await addNewGroup({
                  variables: {
                    gameId,
                    groupName: name,
                    groupDisplayName: displayName,
                  },
                });

                addNotification({
                  status: "success",
                  title: t("success.addGroup.title"),
                  description: t("success.addGroup.description"),
                });
                onClose();
              } catch (err) {
                addNotification({
                  status: "error",
                  title: t("error.addGroup.title"),
                  description: t("error.addGroup.description"),
                });
              }
            }}
          >
            {t("Add")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddGroupModal;
