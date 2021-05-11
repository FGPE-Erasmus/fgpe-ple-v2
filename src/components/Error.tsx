import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Error = ({
  errorContent,
  status,

  refreshTimeout,
  serverConnectionError,
}: {
  errorContent?: string;
  status?: "error" | "info" | "warning" | "success";

  /** Refreshes the page after specified time (in ms) if provided. If serverConnectionError param is true this has a default value of 10 seconds. */
  refreshTimeout?: number;

  /** Shows friendly looking error about problem with server connection. */
  serverConnectionError?: boolean;
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (refreshTimeout || serverConnectionError) {
      const refresh = setTimeout(() => {
        window.location.reload();
      }, refreshTimeout || 10000);

      return () => {
        clearTimeout(refresh);
      };
    }
  }, []);

  return (
    <Alert
      status={status ? status : serverConnectionError ? "info" : "error"}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      maxWidth="700px"
      margin="auto"
      borderRadius={5}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {serverConnectionError
          ? t("error.serverConnection.title")
          : t("error.title")}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {serverConnectionError
          ? t("error.serverConnection.description")
          : t("error.description")}
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
