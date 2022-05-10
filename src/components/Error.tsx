import { ApolloError } from "@apollo/client";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// const getErrorStatus = (err: ApolloError) => {
//   const {graphQLErrors} = err;
//   if (graphQLErrors) {
//     for (let err of graphQLErrors) {
//       if(err.extensions?.code) {
//         switch (err.extensions.code) {
//           // Apollo Server adjusts code to UNAUTHENTICATED
//           // when an AuthenticationError is thrown in a resolver
//           case 'UNAUTHENTICATED':
//             // Modify the operation context with a new token
//                   }
//       }
//       }

// }

const Error = ({
  errorContent,
  status,

  refreshTimeout,
  serverConnectionError,
}: {
  errorContent?: ApolloError;
  status?: "error" | "info" | "warning" | "success";

  /** Refreshes the page after specified time (in ms) if provided. If serverConnectionError param is true this has a default value of 10 seconds. */
  refreshTimeout?: number;

  /** Shows friendly looking error about problem with server connection. */
  serverConnectionError?: boolean;
}) => {
  const { t } = useTranslation();
  const [errorCopied, setErrorCopied] = useState(false);

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
      margin="auto"
      borderRadius={5}
      maxWidth="700px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {serverConnectionError
          ? t("error.serverConnection.title")
          : t("error.title")}
      </AlertTitle>

      <AlertDescription maxWidth="xl" padding={4} width="100%">
        {serverConnectionError
          ? t("error.serverConnection.description")
          : t("error.description")}

        {errorContent && (
          <Flex flexDir={"column"}>
            {
              <Box
                maxWidth="700px"
                overflowX="auto"
                textAlign="left"
                fontSize={12}
                marginTop={5}
              >
                <Table size="sm">
                  <TableCaption placement="top">
                    {t("error.serverGraphQLErrors")}
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>{t("error.code")}</Th>
                      <Th>{t("error.message")}</Th>
                      <Th>{t("error.path")}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {errorContent &&
                      errorContent.graphQLErrors.map((graphQLError, i) => {
                        return (
                          <Tr key={i}>
                            <Td>
                              {graphQLError.extensions
                                ? graphQLError.extensions.code
                                : "-"}
                            </Td>
                            <Td>
                              {graphQLError.message
                                ? graphQLError.message
                                : "-"}
                            </Td>

                            <Td>
                              {graphQLError.path
                                ? graphQLError.path.join(", ")
                                : "-"}
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </Box>
            }
          </Flex>
        )}

        {errorContent ? (
          <InputGroup marginTop={5}>
            <InputRightElement
              pointerEvents="all"
              children={
                <Tooltip label={t("Click to copy")}>
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(errorContent)
                      );
                      setErrorCopied(true);
                    }}
                    size="sm"
                    aria-label={t("copy")}
                    icon={
                      <AnimatePresence exitBeforeEnter>
                        {errorCopied ? (
                          <motion.div
                            key={1}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                          >
                            <CheckIcon />
                          </motion.div>
                        ) : (
                          <motion.div
                            key={2}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                          >
                            <CopyIcon />{" "}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    }
                  />
                </Tooltip>
              }
            />

            <Input
              width={"100%"}
              maxHeight="50px"
              overflowY="scroll"
              textAlign="left"
              fontSize={12}
              onFocus={(e) => e.target.select()}
              value={JSON.stringify(errorContent)}
              readOnly
            />
          </InputGroup>
        ) : (
          t("error.unknownProblem.description")
        )}
      </AlertDescription>
    </Alert>
  );
};

export default Error;
