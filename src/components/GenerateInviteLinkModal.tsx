import { gql, useMutation } from "@apollo/client";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { generateGameTokenMutation } from "../generated/generateGameTokenMutation";
import { generateGroupTokenMutation } from "../generated/generateGroupTokenMutation";
import { getGroupsQuery } from "../generated/getGroupsQuery";

const GENERATE_GROUP_TOKEN = gql`
  mutation generateGroupTokenMutation($gameId: String!, $groupId: String!) {
    generateGroupToken(gameId: $gameId, groupId: $groupId) {
      token
      expiresIn
    }
  }
`;

const GENERATE_GAME_TOKEN = gql`
  mutation generateGameTokenMutation($gameId: String!) {
    generateGameToken(id: $gameId) {
      token
      expiresIn
    }
  }
`;

const GenerateInviteLinkModal = ({
  isOpen,
  onClose,
  groupsData,
  gameId,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupsData: getGroupsQuery;
  gameId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");
  const { t } = useTranslation();

  const [link, setLink] = useState("");

  useEffect(() => {
    setLink("");
  }, [isOpen]);

  const [generateGameToken] =
    useMutation<generateGameTokenMutation>(GENERATE_GAME_TOKEN);

  const [generateGroupToken] =
    useMutation<generateGroupTokenMutation>(GENERATE_GROUP_TOKEN);

  const generateTokens = async () => {
    setLoading(true);
    setLink("");

    let gameToken = "";
    let groupToken = "";

    const generatedGameToken = await generateGameToken({
      variables: {
        gameId,
      },
    });

    gameToken = generatedGameToken.data?.generateGameToken.token || "";

    if (groupId != "") {
      const generatedGroupToken = await generateGroupToken({
        variables: {
          gameId,
          groupId,
        },
      });

      groupToken = generatedGroupToken.data?.generateGroupToken.token || "";
    }

    if (gameToken) {
      const generatedLink =
        `${window.location.origin}${process.env.PUBLIC_URL}/game/enroll/${gameToken}` +
        (groupToken ? `/${groupToken}` : "");

      setLink(generatedLink);
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Generate invite link")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>{t("linkGenerateDescription")}</FormLabel>
            <Select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder={t("placeholders.chooseGroup")}
            >
              {groupsData.groups.map((group, i) => {
                return (
                  <option value={group.id} key={i}>
                    {group.displayName} ({group.name})
                  </option>
                );
              })}
            </Select>
          </FormControl>

          <AnimatePresence>
            {link && (
              <motion.div
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 50 }}
                exit={{ opacity: 0, maxHeight: 0 }}
              >
                <InputGroup mt={2}>
                  <Input placeholder="Enter amount" value={link} readOnly />
                  <InputRightElement>
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                      }}
                      aria-label="Search database"
                      icon={<CopyIcon />}
                    />
                  </InputRightElement>
                </InputGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t("Close")}
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={generateTokens}
            isLoading={loading}
          >
            {t("Generate")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateInviteLinkModal;
