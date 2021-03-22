import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import withChangeAnimation from "../utilities/withChangeAnimation";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Alert
      status="warning"
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
        {t("error.notFound.title")}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {t("error.notFound.description")}
      </AlertDescription>
    </Alert>
  );
};

export default withChangeAnimation(NotFound);
