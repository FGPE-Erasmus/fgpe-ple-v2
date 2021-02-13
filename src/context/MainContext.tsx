import React from "react";

const MainContext = React.createContext<{
  playerId: string | null;
  setPlayerId: (value: string) => void;
}>({
  playerId: null,
  setPlayerId: () => {},
});

export default MainContext;
