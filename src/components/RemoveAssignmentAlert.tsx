import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

export const RemoveAssignmentAlert = ({
  onConfirm,
  isLoading,
  isOpen,
  onOpen,
  onClose,
}: {
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const cancelRef = React.useRef<any>();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {t("Remove the assignment")}
          </AlertDialogHeader>

          <AlertDialogBody>{t("Assignment alert")}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={async () => {
                await onConfirm();
                onClose();
              }}
              ml={3}
            >
              {t("Remove the assignment")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
