import React from "react";

export const SettingsContext = React.createContext({
  editorTheme: "light",
  setEditorTheme: (value: string) => {},
  terminalTheme: "light",
  terminalFontSize: "14",
  setTerminalFontSize: (value: string) => {},
  setTerminalTheme: (value: string) => {},
});
