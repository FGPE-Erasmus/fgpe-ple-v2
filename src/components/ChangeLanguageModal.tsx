import {
  Button,
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
import { SUPPORTED_LANGUAGES } from "../i18n/config";

const ChangeLanguageModal = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Language")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {SUPPORTED_LANGUAGES.sort(function (a, b) {
            if (a.language < b.language) {
              return -1;
            }
            if (a.language > b.language) {
              return 1;
            }
            return 0;
          }).map((language, i) => {
            return (
              <Button
                colorScheme="blue"
                key={i}
                w="100%"
                marginBottom="1"
                size="sm"
                onClick={() => changeLanguage(language.code)}
              >
                {language.language}
              </Button>
            );
          })}
        </ModalBody>

        <ModalFooter alignItems="center" justifyContent="center">
          <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeLanguageModal;
