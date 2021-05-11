import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";

const TextareaWithButton = ({
  value,
  changeValue,
  remove,
}: {
  value: string;
  changeValue: (value: string) => void;
  remove: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
      >
        <Flex alignItems="center" marginBottom={2}>
          <Textarea
            value={value}
            onChange={(e) => {
              changeValue(e.target.value);
            }}
            w="90%"
            placeholder={t("placeholders.provideTestValues")}
          />

          <IconButton
            icon={<CloseIcon />}
            aria-label="remove"
            w="10%"
            marginLeft={2}
            float="right"
            variant="outline"
            onClick={remove}
          />
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
};

const TextareaModal = ({
  isOpen,
  onClose,
  testValues,
  setTestValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  testValues: string[];
  setTestValues: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Provide test values")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={testValues[0]}
            onChange={(e) => {
              let newTestValues = [...testValues];
              newTestValues[0] = e.target.value;
              setTestValues(newTestValues);
            }}
            placeholder={t("placeholders.provideTestValues")}
          />
          {testValues
            .filter((item, i) => i !== 0)
            .map((item, i) => {
              i = i + 1;
              return (
                <TextareaWithButton
                  key={i}
                  value={item}
                  changeValue={(value) => {
                    let newTestValues = [...testValues];
                    newTestValues[i] = value;
                    setTestValues(newTestValues);
                  }}
                  remove={() => {
                    let newTestValues = [...testValues];
                    newTestValues.splice(i, 1);

                    setTestValues(newTestValues);
                  }}
                />
              );
            })}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            colorScheme="gray"
            onClick={() => setTestValues([...testValues, ""])}
          >
            {t("Add more")}
          </Button>
          <Button colorScheme="gray" onClick={onClose}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TextareaModal;
