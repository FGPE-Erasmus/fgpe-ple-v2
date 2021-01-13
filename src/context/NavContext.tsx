import React from "react";

const NavContext = React.createContext<{
  activeGame: { id: string; name: string } | null;
  activeChallenge: { id: string; name: string } | null;
  setActiveGame: (game: { id: string; name: string } | null) => void;
  setActiveChallenge: (challenge: { id: string; name: string } | null) => void;
}>({
  activeGame: null,
  activeChallenge: null,
  setActiveChallenge: () => {},
  setActiveGame: () => {},
});

export default NavContext;
