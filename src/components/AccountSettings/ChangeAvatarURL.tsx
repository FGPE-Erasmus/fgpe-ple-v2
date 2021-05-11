import { Avatar, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Editable from "./Editable";

const ChangeAvatarURL = ({
  changeAvatar,
  avatarURL,
}: {
  avatarURL?: string;
  changeAvatar: ({ avatarURL }: { avatarURL: string }) => Promise<void>;
}) => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <Text marginBottom={2} fontWeight={500}>
        {t("Profile picture")}
      </Text>
      <Flex
        padding={4}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        border="1px solid"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        borderRadius={4}
      >
        <Box width={6 / 8}>
          <Editable
            defaultValue={avatarURL ? avatarURL : t("avatarLink")}
            onChange={async (value) => {
              await changeAvatar({ avatarURL: value });
            }}
            cleanOnEdit
          />
        </Box>

        <Avatar src={avatarURL ? avatarURL : ""} />
      </Flex>
    </Box>
  );
};

export default ChangeAvatarURL;
