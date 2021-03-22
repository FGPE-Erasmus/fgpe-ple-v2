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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type language = {
  code: string;
  language: string;
};

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
  const [supportedLanguages, setSupportedLanguages] = useState<
    null | language[]
  >(null);

  const getSupportedLanguages = () => {
    fetch(`${process.env.PUBLIC_URL}/locales/supported-languages.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setSupportedLanguages(myJson);
      });
  };

  useEffect(() => {
    getSupportedLanguages();
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Language")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {supportedLanguages ? (
            supportedLanguages
              .sort(function (a, b) {
                if (a.language < b.language) {
                  return -1;
                }
                if (a.language > b.language) {
                  return 1;
                }
                return 0;
              })
              .map((language, i) => (
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
              ))
          ) : (
            <span>Loading...</span>
          )}
          {/* {SUPPORTED_LANGUAGES.sort(function (a, b) {
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
          })} */}
        </ModalBody>

        <ModalFooter alignItems="center" justifyContent="center">
          <Button variant="ghost" colorScheme="blue" onClick={onClose}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeLanguageModal;
