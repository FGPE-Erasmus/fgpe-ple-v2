import { validate } from "graphql";
import { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const useHotKeys = ({
  evaluateSubmission,
  validateSubmission,
}: {
  evaluateSubmission: () => void;
  validateSubmission: () => void;
}) => {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.code === "Backslash" || e.code === "backslash")
      ) {
        console.log("evaluate");
        evaluateSubmission();
        return;
      }

      if (
        (e.metaKey || e.ctrlKey) &&
        (e.code === "Enter" || e.code === "enter")
      ) {
        console.log("validate");

        validateSubmission();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.code === "KeyM") {
        // validateSubmission();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.code === "Comma") {
        // validateSubmission();
        return;
      }
    });
  }, []);

  return null;
};

export default useHotKeys;
