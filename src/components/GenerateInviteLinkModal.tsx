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
  const [groupId, setGroupId] = useState("");
  const { t } = useTranslation();

  const [gameToken, setGameToken] = useState("");
  const [groupToken, setGroupToken] = useState("");

  const [link, setLink] = useState("");

  useEffect(() => {
    setGameToken("");
    setGroupToken("");
    setLink("");
  }, [isOpen]);

  const [
    generateGameToken,
    { data: gameTokenData, loading: gameTokenLoading },
  ] = useMutation<generateGameTokenMutation>(GENERATE_GAME_TOKEN);

  const [
    generateGroupToken,
    { data: groupTokenData, loading: groupTokenLoading },
  ] = useMutation<generateGroupTokenMutation>(GENERATE_GROUP_TOKEN);

  const generateTokens = async () => {
    setGroupToken("");
    setGameToken("");

    await generateGameToken({
      variables: {
        gameId,
      },
    });
    gameTokenData && setGameToken(gameTokenData.generateGameToken.token);

    if (groupId != "") {
      await generateGroupToken({
        variables: {
          gameId,
          groupId,
        },
      });

      groupTokenData && setGameToken(groupTokenData.generateGroupToken.token);
    }

    if (gameTokenData) {
      const generatedLink =
        `${window.location.origin}${process.env.PUBLIC_URL}/enroll?game=${gameTokenData.generateGameToken.token}` +
        (groupTokenData
          ? `&group=${groupTokenData.generateGroupToken.token}`
          : "");

      console.log(
        groupTokenData
          ? `&group=${groupTokenData.generateGroupToken.token}`
          : ""
      );
      setLink(generatedLink);
    }
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
            {!gameTokenLoading &&
              !groupTokenLoading &&
              gameTokenData &&
              gameToken &&
              link && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: 50 }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                >
                  <InputGroup mt={2}>
                    <Input placeholder="Enter amount" isDisabled value={link} />
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
            disabled={gameTokenLoading || groupTokenLoading}
            isLoading={gameTokenLoading || groupTokenLoading}
          >
            {t("Generate")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateInviteLinkModal;
