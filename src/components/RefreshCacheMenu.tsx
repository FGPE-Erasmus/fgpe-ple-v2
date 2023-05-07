import { Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiRefresh } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { useNotifications } from "./Notifications";

const RefreshCacheMenu = ({
  refetch,
  loading,
  size,
  disabled,
  zIndex,
}: {
  refetch: () => Promise<any>;
  loading: boolean;
  size?: string;
  disabled?: boolean;
  zIndex?: number | "auto";
}) => {
  const { add: addNotification } = useNotifications();
  const { t } = useTranslation();

  const [internalLoading, setInternalLoading] = useState(false);
  const [refetched, setRefetched] = useState(false);

  const refetchAndChangeState = async () => {
    setInternalLoading(true);
    try {
      await refetch();
      setRefetched(true);
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.title"),
        description: t("error.description"),
      });
      setRefetched(false);
    }
    setInternalLoading(false);
  };

  return (
    <Flex
      justifyContent="flex-end"
      cursor={disabled ? "not-allowed" : "pointer"}
      pointerEvents={disabled ? "none" : "auto"}
      zIndex={zIndex || "auto"}
    >
      <Button
        data-cy="refresh-button"
        isLoading={internalLoading || loading}
        loadingText={t("Loading")}
        leftIcon={
          refetched && !internalLoading && !loading ? <MdDone /> : <BiRefresh />
        }
        size={size ? size : "sm"}
        onClick={() => {
          refetchAndChangeState();
        }}
      >
        {refetched && !internalLoading && !loading
          ? t("Refreshed")
          : t("Refresh")}
      </Button>
    </Flex>
  );
};

export default RefreshCacheMenu;
