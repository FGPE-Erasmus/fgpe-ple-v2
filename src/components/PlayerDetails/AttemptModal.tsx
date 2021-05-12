import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  HStack,
  Box,
  useColorMode,
  Stack,
  Flex,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery_player_submissions,
  getPlayerQuery_player_validations,
} from "../../generated/getPlayerQuery";
import DetailsCard from "../DetailsCard";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import SyntaxHighlighter from "react-syntax-highlighter";
import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CalendarIcon } from "@chakra-ui/icons";
import ReactHtmlParser from "react-html-parser";

dayjs.extend(LocalizedFormat);

const getOutputs = (
  activeAttempt: Partial<getPlayerQuery_player_validations>
) => {
  if (activeAttempt.outputs) {
    return Object.keys(activeAttempt.outputs).map((objectKey, i) => {
      return activeAttempt.outputs[objectKey];
    });
  } else {
    return "";
  }
};

const AttemptModal = ({
  isOpen,
  onClose,
  activeAttempt,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeAttempt?: Partial<getPlayerQuery_player_validations>;
}) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="xl">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          {activeAttempt?.outputs ? t("validation") : t("submission")}
        </DrawerHeader>
        <ModalCloseButton />
        <DrawerBody height="100%">
          <Stack
            direction={{ base: "column", lg: "row" }}
            width="100%"
            marginBottom={2}
          >
            {activeAttempt?.exerciseId && (
              <DetailsCard
                darkerBorder
                title={t("Exercise")}
                content={activeAttempt?.exerciseId}
                noMargins
              />
            )}
            {activeAttempt?.language && (
              <DetailsCard
                darkerBorder
                title={t("Language")}
                content={activeAttempt?.language}
                noMargins
              />
            )}
            {activeAttempt?.result && (
              <DetailsCard
                darkerBorder
                title={t("Result")}
                content={activeAttempt.result}
                noMargins
              />
            )}
          </Stack>

          {activeAttempt?.submittedAt && (
            <Flex justifyContent="center" alignItems="center" marginTop={4}>
              <CalendarIcon marginRight={2} />
              <Text fontSize={14}>
                {t("Submitted at")}{" "}
                {dayjs(activeAttempt?.submittedAt).format("lll")}
              </Text>
            </Flex>
          )}

          <Flex
            height="calc(100% - 155px)"
            flexDirection={{ base: "column", md: "row" }}
            overflowY={{ base: "scroll", md: "auto" }}
          >
            {activeAttempt?.program && (
              <Box
                width={activeAttempt?.outputs ? 2 / 3 : "100%"}
                marginTop={4}
                marginBottom={4}
                borderRadius={4}
                // maxH="40vh"
                overflowY="auto"
              >
                <SyntaxHighlighter
                  wrapLines
                  wrapLongLines
                  customStyle={{
                    fontSize: "14px",
                    // minHeight: "200px",
                    height: "100%",
                  }}
                  language={
                    activeAttempt?.language ? activeAttempt.language : "plain"
                  }
                  style={colorMode === "dark" ? atomOneDark : docco}
                >
                  {activeAttempt.program}
                </SyntaxHighlighter>
              </Box>
            )}

            {activeAttempt?.outputs && (
              <Box
                width={1 / 3}
                marginTop={4}
                marginBottom={4}
                borderRadius={4}
                marginLeft={2}
                // height="100%"
                // maxHeight={"40vh"}
                overflowY="auto"
              >
                <SyntaxHighlighter
                  wrapLines
                  wrapLongLines
                  customStyle={{
                    fontSize: "14px",
                    // minHeight: "200px",
                    height: "100%",
                  }}
                  language={
                    activeAttempt?.language ? activeAttempt.language : "plain"
                  }
                  style={colorMode === "dark" ? atomOneDark : docco}
                >
                  {(activeAttempt.feedback ? activeAttempt.feedback : "") +
                    getOutputs(activeAttempt)}
                </SyntaxHighlighter>
              </Box>
            )}

            {/* {activeAttempt.} */}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AttemptModal;
