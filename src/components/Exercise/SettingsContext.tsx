import React from "react";

export const SettingsContext = React.createContext({
  editorTheme: "light",
  setEditorTheme: (value: string) => {},
  terminalTheme: "light",
  setTerminalTheme: (value: string) => {},
});
