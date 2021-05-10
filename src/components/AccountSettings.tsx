import React, { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import withChangeAnimation from "../utilities/withChangeAnimation";
import { Box, VStack } from "@chakra-ui/layout";
import {
  Text,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  useEditableControls,
  useColorMode,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useNotifications } from "./Notifications";

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
    if (newPassword == confirmationPassword) {
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
      <Text marginBottom={2}>{t("Change password")}</Text>
      <Box
        border="1px solid"
        borderColor={colorMode == "dark" ? "gray.700" : "gray.200"}
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
                newPassword != confirmationPassword &&
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

const AccountSettings = () => {
  const { add: addNotification } = useNotifications();

  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<any>({});

  const loadUserInfo = async () => {
    await keycloak.loadUserInfo();
    if (keycloak.userInfo) {
      console.log(keycloak.userInfo);
      setUserInfo(
        keycloak.userInfo as { given_name: string; family_name: string }
      );
      //   console.log("USER INFO", keycloak.userInfo);
    }
  };

  useEffect(() => {
    loadUserInfo();
    axios.defaults.headers.post["Authorization"] = `Bearer ${keycloak.token}`;
  }, []);

  if (!userInfo.family_name) {
    return <span>{t("Loading")}</span>;
  }

  const changePassword = async ({
    currentPassword,
    newPassword,
    confirmation,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmation: string;
  }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${keycloak.realm}/account/credentials/password`,
        {
          currentPassword,
          newPassword,
          confirmation,
        }
      );

      console.log("success");
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.passwordChange.title"),
        description: t("error.passwordChange.description"),
      });
      console.log(err);
    }
  };

  const editUserDetails = async ({
    firstName,
    lastName,
  }: {
    firstName?: String;
    lastName?: String;
  }) => {
    await axios.post(
      `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${keycloak.realm}/account/`,
      {
        firstName: firstName ? firstName : userInfo.given_name,
        lastName: lastName ? lastName : userInfo.family_name,
      }
    );
  };

  return (
    <Box maxWidth={500} margin="auto">
      <Heading
        as="h3"
        size="md"
        marginTop={5}
        marginBottom={5}
        width="100%"
        textAlign="center"
      >
        {t("Account settings")}
      </Heading>

      <VStack spacing={3}>
        <Editable
          defaultValue={userInfo.given_name}
          label={t("First name")}
          onChange={async (value) => {
            await editUserDetails({ firstName: value });
            setUserInfo({ ...userInfo, given_name: value });
          }}
        />
        <Editable
          defaultValue={userInfo.family_name}
          label={t("Last name")}
          onChange={async (value) => {
            await editUserDetails({ lastName: value });
            setUserInfo({ ...userInfo, family_name: value });
          }}
        />

        <PasswordChangeForm onSubmit={changePassword} />
      </VStack>
    </Box>
  );
};

interface EditableProps {
  defaultValue: string;
  label: string;
  onChange: (value: string) => Promise<void>;
}

const Editable = ({ defaultValue, label, onChange }: EditableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Flex justifyContent="space-between">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isEditing}
        />
        {!isEditing ? (
          <IconButton
            marginLeft={2}
            onClick={() => setIsEditing(true)}
            aria-label="Edit"
            icon={<EditIcon />}
          />
        ) : (
          <Flex>
            <IconButton
              isLoading={loading}
              marginLeft={2}
              onClick={async () => {
                setLoading(true);
                try {
                  await onChange(value);
                } catch (err) {
                  setValue(defaultValue);
                }
                setLoading(false);
                setIsEditing(false);
              }}
              aria-label="Accept"
              icon={<CheckIcon />}
            />
            <IconButton
              marginLeft={2}
              onClick={() => {
                setValue(defaultValue);
                setIsEditing(false);
              }}
              aria-label="Cancel"
              icon={<CloseIcon />}
            />
          </Flex>
        )}
      </Flex>
    </FormControl>
  );
};

export default withChangeAnimation(AccountSettings);
