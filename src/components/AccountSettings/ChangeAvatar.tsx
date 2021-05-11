import { CloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Avatar,
  useColorMode,
  Box,
  Button,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ChangeAvatar = ({
  changeAvatar,
  avatarDataURL,
  loadUserProfile,
}: {
  avatarDataURL?: string;
  changeAvatar: ({ avatarDataURL }: { avatarDataURL: string }) => Promise<void>;
  loadUserProfile: () => void;
}) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<ArrayBuffer | string>("");
  const [fileName, setFileName] = useState("");
  const { t } = useTranslation();

  const encodeImageFileAsURL = (element: any) => {
    const file = element.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = function () {
      //   console.log("RESULT", reader.result);
      setImageLoaded(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

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
        borderColor={colorMode == "dark" ? "gray.700" : "gray.200"}
        borderRadius={4}
      >
        <Box width={7 / 8}>
          {imageLoaded ? (
            <Flex justifyContent="flex-start" alignItems="center">
              <Text>
                {t("File")}: {fileName.substr(0, 6)}...
              </Text>
              <Button
                isLoading={loading}
                size="sm"
                marginLeft={4}
                onClick={async () => {
                  setLoading(true);
                  await changeAvatar({ avatarDataURL: imageLoaded.toString() });
                  loadUserProfile();
                  setLoading(false);
                  setImageLoaded("");
                }}
              >
                {t("Submit")}
              </Button>
              <IconButton
                onClick={() => {
                  setImageLoaded("");
                  setFileName("");
                }}
                marginLeft={2}
                size="sm"
                aria-label="Cancel"
                icon={<CloseIcon />}
              />
            </Flex>
          ) : (
            <input
              type="file"
              onChange={(e) => encodeImageFileAsURL(e.target)}
            />
          )}
        </Box>

        <Avatar
          src={
            imageLoaded
              ? imageLoaded.toString()
              : avatarDataURL
              ? avatarDataURL
              : ""
          }
        />
      </Flex>
    </Box>
  );
};

export default ChangeAvatar;
