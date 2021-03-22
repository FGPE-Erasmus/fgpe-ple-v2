import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

const Error = ({
  errorContent,
  status,
}: {
  errorContent?: string;
  status?: "error" | "info" | "warning" | "success";
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Alert
      status={status ? status : "error"}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      //   height="200px"
      maxWidth="700px"
      margin="auto"
      borderRadius={5}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {t("error.title")}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {t("error.description")}
        {errorContent && (
          <Box
            maxHeight="200px"
            overflowY="scroll"
            textAlign="left"
            fontSize={12}
            marginTop={5}
          >
            {errorContent}
          </Box>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default Error;
