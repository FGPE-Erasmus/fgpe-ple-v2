import { Box, VStack } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import { useNotifications } from "../Notifications";
import ChangeAvatar from "./ChangeAvatar";
import Editable from "./Editable";
import PasswordChangeForm from "./PasswordChangeForm";

const AccountSettings = () => {
  const { add: addNotification } = useNotifications();

  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState<any>({});

  const loadUserProfile = async () => {
    const keycloakUserProfile = await keycloak.loadUserProfile();
    if (keycloakUserProfile) {
      console.log("KK", keycloakUserProfile);
      setUserProfile(keycloakUserProfile);
    }

    axios.defaults.headers.post["Authorization"] = `Bearer ${keycloak.token}`;
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (!userProfile.email) {
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
        firstName: firstName ? firstName : userProfile.firstName,
        lastName: lastName ? lastName : userProfile.lastName,
      }
    );
  };

  const changeAvatar = async ({ avatarDataURL }: { avatarDataURL: string }) => {
    const params = {
      [process.env.REACT_APP_KEYCLOAK_AVATAR || "avatar"]: avatarDataURL,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${keycloak.realm}/account/`,
        {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          attributes: {
            ...params,
          },
        }
      );
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
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
          defaultValue={userProfile.firstName}
          label={t("First name")}
          onChange={async (value) => {
            await editUserDetails({ firstName: value });
            setUserProfile({ ...userProfile, lastName: value });
          }}
        />
        <Editable
          defaultValue={userProfile.lastName}
          label={t("Last name")}
          onChange={async (value) => {
            await editUserDetails({ lastName: value });
            setUserProfile({ ...userProfile, lastName: value });
          }}
        />

        <ChangeAvatar
          changeAvatar={changeAvatar}
          avatarDataURL={userProfile[process.env.REACT_APP_KEYCLOAK_AVATAR]}
          loadUserProfile={loadUserProfile}
        />

        <PasswordChangeForm onSubmit={changePassword} />
      </VStack>
    </Box>
  );
};

export default withChangeAnimation(AccountSettings);
