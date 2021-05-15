import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Collapse,
} from "@chakra-ui/react";
import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTranslation } from "react-i18next";

dayjs.extend(customParseFormat);

export const isDateValid = (date: string) => {
  return dayjs(date, "YYYY-MM-DD", true).isValid();
};

interface StartAndEndDateInputI {
  startDateError: boolean;
  startDate: string;
  endDateError: boolean;
  setEndDateError: (value: boolean) => void;
  setStartDateError: (value: boolean) => void;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  isEndLaterThanStart: boolean;
  setEndLaterThanStart: (value: boolean) => void;
}

const StartAndEndDateInput = ({
  startDate,
  startDateError,
  endDate,
  endDateError,
  isEndLaterThanStart,
  setEndLaterThanStart,
  setStartDate,
  setStartDateError,
  setEndDate,
  setEndDateError,
}: StartAndEndDateInputI) => {
  const { t } = useTranslation();

  const validateAndSetStartDate = (value: string) => {
    if (isDateValid(value)) {
      if (endDate) {
        setEndLaterThanStart(
          dayjs(endDate, "YYYY-MM-DD").isAfter(dayjs(value, "YYYY-MM-DD"))
        );
      }

      setStartDateError(false);
    } else {
      setStartDateError(true);
    }

    setStartDate(value);
  };

  const validateAndSetEndDate = (value: string) => {
    if (isDateValid(value)) {
      if (startDate) {
        setEndLaterThanStart(
          dayjs(value, "YYYY-MM-DD").isAfter(dayjs(startDate, "YYYY-MM-DD"))
        );
      }

      setEndDateError(false);
    } else {
      setEndDateError(true);
    }

    setEndDate(value);
  };

  return (
    <>
      <Flex>
        <FormControl paddingRight={1}>
          <FormLabel id="start">{t("addGame.startDate")}</FormLabel>
          <Input
            isInvalid={!!(startDateError && startDate)}
            value={startDate || ""}
            type="text"
            placeholder="YYYY-MM-DD"
            onChange={(e) => validateAndSetStartDate(e.target.value)}
          />
        </FormControl>

        <FormControl paddingLeft={1}>
          <FormLabel id="end">{t("addGame.endDate")}</FormLabel>
          <Input
            isInvalid={!!(endDateError && endDate)}
            type="text"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChange={(e) => validateAndSetEndDate(e.target.value)}
          />
        </FormControl>
      </Flex>

      <Collapse in={!isEndLaterThanStart} animateOpacity>
        <p style={{ color: "red", textAlign: "center" }}>
          {t("addGame.error.startLaterThanEnd")}
        </p>
      </Collapse>
    </>
  );
};

export default StartAndEndDateInput;
