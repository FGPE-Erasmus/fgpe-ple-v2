import { useMutation } from "@apollo/client";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
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
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { REGISTER_PLATFORM } from "../graphql/registerPlatform";

const RegisterPlatformForm = () => {
  const { t } = useTranslation();

  const [registerPlatform] = useMutation(REGISTER_PLATFORM);

  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [moodleUrl, setMoodleUrl] = useState("");

  const [isPublicKeyModalOpen, setPublicKeyModalOpen] = useState(false);
  const [publicKey, setPublicKey] = useState("");

  const submitRegisterPlatform = async () => {
    setLoading(true);
    const result = await registerPlatform({
      variables: {
        name: clientName,
        clientId,
        url: moodleUrl,
      },
    });

    setPublicKeyModalOpen(true);

    setPublicKey(result.data.registerPlatform.publicKey);

    setLoading(false);
  };

  const onClose = () => {
    setPublicKeyModalOpen(false);
  };

  return (
    <Box width={500} margin="auto">
      <Heading
        as="h3"
        size="md"
        marginTop={5}
        marginBottom={5}
        width="100%"
        textAlign="center"
      >
        {t("registerPlatformForm.title")}
      </Heading>
      <VStack spacing={3}>
        <FormControl id="clientName" isRequired>
          <FormLabel>{t("registerPlatformForm.clientName")}</FormLabel>
          <Input
            type="text"
            placeholder={t("registerPlatformForm.clientNamePlaceholder")}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </FormControl>

        <FormControl id="clientId" isRequired>
          <FormLabel>{t("registerPlatformForm.clientId")}</FormLabel>
          <Input
            type="text"
            placeholder={t("registerPlatformForm.clientIdPlaceholder")}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </FormControl>

        <FormControl id="moodleUrl" isRequired>
          <FormLabel>{t("registerPlatformForm.moodleUrl")}</FormLabel>
          <Input
            type="text"
            placeholder={t("registerPlatformForm.moodleUrlPlaceholder")}
            value={moodleUrl}
            onChange={(e) => setMoodleUrl(e.target.value)}
          />
        </FormControl>

        <Button
          isDisabled={!clientName || !clientId || !moodleUrl || loading}
          isLoading={loading}
          onClick={submitRegisterPlatform}
        >
          {t("Submit")}
        </Button>
      </VStack>
      <Modal isOpen={isPublicKeyModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("ltiPublicKey")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody position="relative" overflow="hidden">
            <pre style={{
              "overflow":"hidden"
            }}>{publicKey}</pre>
          </ModalBody>
          <ModalFooter>
            <AnimatePresence>
              {publicKey && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: 50 }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                >
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(publicKey);
                    }}
                    aria-label="Clipboard"
                    icon={<CopyIcon />}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisterPlatformForm;
