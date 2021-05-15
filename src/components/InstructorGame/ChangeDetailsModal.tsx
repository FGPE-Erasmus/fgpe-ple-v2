import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Switch,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isDateValid } from "../AddGameModal";
import StartAndEndDateInput from "../StartAndEndDateInput";
import { CHANGE_GAME_END_DATE } from "../../graphql/changeGameEndDate";
import { changeGameEndDateMutation } from "../../generated/changeGameEndDateMutation";
import { useMutation } from "@apollo/client";
import { CHANGE_GAME_START_DATE } from "../../graphql/changeGameStartDate";
import { changeGameStartDateMutation } from "../../generated/changeGameStartDateMutation";
import { SET_GAME_AVAILABILITY } from "../../graphql/setGameAvailability";
import { setGameAvailabilityMutation } from "../../generated/setGameAvailabilityMutation";
dayjs.extend(customParseFormat);

const ChangeDetailsModal = ({
  isOpen,
  onClose,
  isGamePrivate,
  gameId,
  defaultStartDate,
  defaultEndDate,
  refetchGame,
}: {
  isOpen: boolean;
  onClose: () => void;
  isGamePrivate: boolean;
  gameId: string;
  defaultStartDate: string;
  defaultEndDate: string;
  refetchGame: () => Promise<any>;
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [gamePrivate, setGamePrivate] = useState(isGamePrivate);

  const [startDate, setStartDate] = useState(defaultStartDate || "");
  const [startDateError, setStartDateError] = useState(false);

  const [endDate, setEndDate] = useState(defaultEndDate || "");
  const [endDateError, setEndDateError] = useState(false);

  const [isEndLaterThanStart, setEndLaterThanStart] = useState(true);

  const [setGameAvailability] = useMutation<setGameAvailabilityMutation>(
    SET_GAME_AVAILABILITY
  );

  const [changeGameStartDate] = useMutation<changeGameStartDateMutation>(
    CHANGE_GAME_START_DATE
  );

  const [changeGameEndDate] =
    useMutation<changeGameEndDateMutation>(CHANGE_GAME_END_DATE);

  useEffect(() => {
    setEndDate(defaultEndDate || "");
    setStartDate(defaultStartDate || "");
  }, [isOpen]);

  const changeGameDetails = async () => {
    setLoading(true);

    if (startDate && !startDateError) {
      await changeGameStartDate({
        variables: {
          gameId,
          startDate,
        },
      });
    }

    if (endDate && !endDateError) {
      await changeGameEndDate({
        variables: {
          gameId,
          endDate,
        },
      });
    }

    if (gamePrivate !== isGamePrivate) {
      await setGameAvailability({
        variables: {
          gameId,
          isPrivate: gamePrivate,
        },
      });
    }

    await refetchGame();
    onClose();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Change availability")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StartAndEndDateInput
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setEndDateError={setEndDateError}
            setStartDateError={setStartDateError}
            isEndLaterThanStart={isEndLaterThanStart}
            setEndLaterThanStart={setEndLaterThanStart}
            startDateError={startDateError}
            endDateError={endDateError}
          />
          <Checkbox
            isChecked={gamePrivate}
            size="md"
            marginTop={4}
            fontWeight={500}
            onChange={(value) => {
              setGamePrivate(value.target.checked);
            }}
          >
            {t("addGame.setPrivate")}
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            marginRight={2}
            colorScheme="blue"
            onClick={onClose}
          >
            {t("Close")}
          </Button>
          <Button
            isLoading={loading}
            colorScheme="blue"
            onClick={changeGameDetails}
            disabled={
              !(
                (startDate ? !startDateError : true) &&
                (endDate ? !endDateError : true) &&
                (startDate || endDate ? isEndLaterThanStart : true)
              )
            }
          >
            {t("Submit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeDetailsModal;
