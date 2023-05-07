import React from "react";

const NavContext = React.createContext<{
  activeGame: { id: string; name: string } | null;
  // activeChallenge: { id: string; name: string } | null;
  setActiveGame: (game: { id: string; name: string } | null) => void;
  // setActiveChallenge: (challenge: { id: string; name: string } | null) => void;
  setShouldBaseTutorialStart: (v: boolean) => void;
  shouldBaseTutorialStart: boolean;
  toggledDarkMode: boolean;
  setToggledDarkMode: (v: boolean) => void;
}>({
  activeGame: null,
  // activeChallenge: null,
  // setActiveChallenge: () => {},
  setActiveGame: () => {},
  setShouldBaseTutorialStart: (v) => {},
  shouldBaseTutorialStart: false,
  toggledDarkMode: false,
  setToggledDarkMode: () => {},
});

export default NavContext;
