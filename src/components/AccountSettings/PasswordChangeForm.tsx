import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const PasswordInput = ({
  value,
  onChange,
  isInvalid,
}: {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}) => {
  const [show, setShow] = useState(false);

  return (
    <Flex>
      <Input
        isInvalid={isInvalid ? isInvalid : false}
        type={!show ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton
        marginLeft={2}
        onClick={() => setShow(!show)}
        aria-label="Edit"
        icon={!show ? <ViewOffIcon /> : <ViewIcon />}
      />
    </Flex>
  );
};

const PasswordChangeForm = ({
  onSubmit,
}: {
  onSubmit: ({
    currentPassword,
    newPassword,
    confirmation,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmation: string;
  }) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const submitPasswordChange = async () => {
    setLoading(true);
    if (newPassword === confirmationPassword) {
      try {
        onSubmit({
          currentPassword,
          newPassword,
          confirmation: confirmationPassword,
        });
      } catch (err) {
        console.log("ERROR", err);
      }
    }

    setLoading(false);
  };

  return (
    <Box width="100%" paddingTop={4}>
      <Text marginBottom={2} fontWeight={500}>
        {t("Change password")}
      </Text>
      <Box
        border="1px solid"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        width="100%"
        borderRadius={4}
        padding={4}
      >
        <VStack spacing={3}>
          <FormControl>
            <FormLabel>{t("Old password")}</FormLabel>
            <PasswordInput
              value={currentPassword}
              onChange={setCurrentPassword}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t("New password")}</FormLabel>
            <PasswordInput value={newPassword} onChange={setNewPassword} />
          </FormControl>

          <FormControl>
            <FormLabel>{t("Repeat new password")}</FormLabel>
            <PasswordInput
              isInvalid={
                newPassword !== confirmationPassword &&
                confirmationPassword.length > 1
              }
              value={confirmationPassword}
              onChange={setConfirmationPassword}
            />
          </FormControl>

          <Button
            isDisabled={
              !currentPassword ||
              !newPassword ||
              !confirmationPassword ||
              loading
            }
            isLoading={loading}
            onClick={submitPasswordChange}
          >
            {t("Submit")}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default PasswordChangeForm;
