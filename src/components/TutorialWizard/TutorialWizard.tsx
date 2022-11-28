import { Button, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";

const TUTORIALS_PORTAL = document.getElementById("tutorial");

interface TutorialStep {
  ref: { current: HTMLElement | null };
  content: string;
  canGoNext?: boolean;
}

const TutorialWizard = ({
  tutorialSteps,
  isTutorialWizardOpen,
  setTutorialWizardOpen,
}: {
  tutorialSteps: TutorialStep[];
  isTutorialWizardOpen: boolean;
  setTutorialWizardOpen: (v: boolean) => void;
}) => {
  const [tutorial, setTutorial] = useState<TutorialStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const canGoNext = useMemo(() => {
    return tutorial.length < 1
      ? false
      : typeof tutorial[activeStepIndex].canGoNext !== "undefined"
      ? tutorial[activeStepIndex].canGoNext
      : true;
  }, [activeStepIndex, tutorial]);

  useEffect(() => {
    tutorial.length > 0 && tutorial[activeStepIndex].ref.current?.focus();
  }, [activeStepIndex]);

  useEffect(() => {
    tutorialSteps.forEach((step, i) => {
      if (!step.ref.current) {
        return "";
      }

      setTutorial(tutorialSteps);

      const stepClassName = `step-${i}`;
      if (!step.ref.current.classList.contains(stepClassName)) {
        step.ref.current.classList.add(stepClassName);
      }

      console.log(step.ref.current);
    });
  }, [tutorialSteps]);

  if (!TUTORIALS_PORTAL) {
    return <></>;
  }

  return ReactDOM.createPortal(
    isTutorialWizardOpen && (
      <>
        <style>
          {tutorial
            .filter((_x, i) => i === activeStepIndex)
            .map((step, i) => {
              const stepClassName: string = `step-${activeStepIndex}`;

              return `
            html {
                pointer-events:  none !important;
            }

            .${stepClassName} {
                z-index: 1000;
                box-shadow: 0 0 0 99999px rgba(0, 0, 0, .9), inset 0 0 10px #000;
               
                pointer-events:  auto;
                border-radius: 4px;
            }

            .${stepClassName}:after {
                content: '${step.canGoNext ? "✅" : ""} ${step.content}';
                margin-top: 1rem;
                position: absolute;
                left: 0;
                top: ${(step.ref.current?.offsetHeight || 40) + 2}px;
                width: 100%;
                min-width: 200px;
                max-width: 500px;
                z-index: 1052;
                color: #fff;
                white-space: pre-wrap;
                font-size: 15px;
                line-height: 1.2em;
                text-align: left;
            }`;
            })}
        </style>
        <TutorialBox>
          <Flex className="tutorial-buttons">
            <Button variant="outline">Close</Button>
            <Button
              disabled={!canGoNext}
              onClick={() => setActiveStepIndex(activeStepIndex + 1)}
            >
              Next
            </Button>
          </Flex>
        </TutorialBox>
      </>
    ),
    TUTORIALS_PORTAL
  );
};

const TutorialBox = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: all;

  .tutorial-buttons {
    position: absolute;
    z-index: 9999;
    gap: 8px;
    width: 100%;
    justify-content: space-between;
    padding: 16px;
    bottom: 0px;
  }
`;

export default TutorialWizard;
