import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Stack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useRef } from "react";
import RewardExample from "../images/reward-example.jpeg";
import Reward from "react-rewards";

const Alerts = () => {
  const rewardRef = useRef<any>();

  const callReward = () => {
    setTimeout(() => {
      rewardRef.current.rewardMe();
    }, 100);
  };

  return (
    <Box
      position="absolute"
      width="100%"
      bottom="66px"
      left="calc(6%)"
      zIndex="999"
      pointerEvents="none"
    >
      <Stack
        spacing={5}
        margin="auto"
        textAlign="center"
        width="50%"
        pointerEvents="all"
      >
        {/* <Alert
          status="info"
          textAlign="left"
          // boxShadow="0px 0px 34px 5px #70acfb"
        >
          <AlertIcon />
          Hint: This editor has a lot of features: code completion, parameter
          info, quick info, and member lists. Click F1 to show!
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert> */}
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
          <Alert
            status="success"
            variant="solid"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            // boxShadow="0px 0px 34px 5px #70fbaa"
            onClick={() => {
              callReward();
            }}
          >
            <RewardImage src={RewardExample} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              You've got a new reward: Hardworker!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Reached 20 submissions.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        </Reward>
        <Alert
          status="success"
          variant="solid"
          textAlign="left"
          colorScheme="purple"
          // boxShadow="0px 0px 34px 5px #a570fb"
        >
          <AlertIcon />
          You've just outpaced everyone! Check the ranking
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      </Stack>
    </Box>
  );
};

const RewardImage = styled.img`
  max-height: 100px;
  border-radius: 5px;
`;

export default Alerts;
