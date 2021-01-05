import React from "react";
import { ThemeProvider } from "@emotion/react";
import "./i18n/config";
import { useTranslation } from "react-i18next";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Homepage from "./containers/HomePage";
import Navbar from "./components/Navbar";

function App() {
  const { t, i18n, ready } = useTranslation();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <div>
        <Navbar />
        <Homepage />
        <h2>{t("title")}</h2>
        <p>{t("description.part1")}</p>
        <p>{t("description.part2")}</p>

        <button
          onClick={() => {
            i18n.changeLanguage("pl");
          }}
        >
          Polski
        </button>
        <button
          onClick={() => {
            i18n.changeLanguage("en");
          }}
        >
          English
        </button>
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
