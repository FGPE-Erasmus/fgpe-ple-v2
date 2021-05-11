// @flow

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Reward from "react-rewards";
import { RewardType } from "../../generated/globalTypes";

const Ctx = React.createContext({
  add: (value: NotificationI) => {},
  remove: (id: any) => {},
});

// Styled Components
// ==============================

interface NotificationI {
  status?: "success" | "info" | "warning" | "error";
  title: string;
  description?: string | null;
  showFireworks?: boolean;
  rewardKind?: RewardType | null;
  /** data:image/jpeg;base64... */
  rewardImage?: string | null;
}

const ToastContainer = (props: any) => (
  <Box
    position="absolute"
    top="0"
    left="50%"
    transform="translateX(-50%)"
    zIndex={9999}
    {...props}
  />
);

const Toast = ({
  content,
  onDismiss,
}: {
  content: NotificationI;
  onDismiss: any;
}) => {
  const rewardRef = useRef<any>();

  useEffect(() => {
    if (content.showFireworks) {
      rewardRef.current.rewardMe();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, zIndex: 999 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {content.showFireworks ? (
        <Reward
          ref={(ref) => {
            rewardRef.current = ref;
          }}
          type="confetti"
          config={{
            angle: 90,
            decay: 0.91,
            spread: 200,
            startVelocity: 35,
            elementCount: 80,
            elementSize: 8,
            lifetime: 200,
            zIndex: 10,
            springAnimation: true,
          }}
        >
          <NotificationContent content={content} onDismiss={onDismiss} />
        </Reward>
      ) : (
        <NotificationContent content={content} onDismiss={onDismiss} />
      )}
    </motion.div>
  );
};

const NotificationContent = ({
  content,
  onDismiss,
}: {
  content: NotificationI;
  onDismiss: any;
}) => (
  <Alert
    status={content.status ? content.status : "success"}
    variant="solid"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    width="100%"
    maxWidth="600px"
    minWidth="200px"
    marginTop={4}
    padding={12}
    zIndex={999}
  >
    {content.rewardImage && <RewardImage src={content.rewardImage} />}
    <AlertTitle mt={4} mb={1} fontSize="lg">
      {content.title}
    </AlertTitle>
    {content.description && (
      <AlertDescription maxWidth="sm">{content.description}</AlertDescription>
    )}
    <CloseButton
      position="absolute"
      right="8px"
      top="8px"
      onClick={onDismiss}
    />
  </Alert>
);

const RewardImage = styled.img`
  max-height: 100px;
  border-radius: 5px;
`;

// Provider
// ==============================

let toastCount = 0;

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<any | any[]>([]);

  const add = (content: any) => {
    const id = toastCount++;
    const toast = { content, id };
    setToasts([...toasts, toast]);
  };
  const remove = (id: any) => {
    const newToasts = toasts.filter((t: any) => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = (id: any) => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }: { content: any; id: any }) => (
          <Toast
            content={content}
            key={id}
            onDismiss={onDismiss(id)}
            {...rest}
          />
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useNotifications = () => React.useContext(Ctx);
