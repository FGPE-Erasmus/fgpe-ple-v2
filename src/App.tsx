import React from "react";
import "./i18n/config";
import { useTranslation } from "react-i18next";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";

import Homepage from "./components/HomePage";
import Profile from "./components/Profile";
import MainLoading from "./components/MainLoading";
import ProfileInGame from "./components/ProfileInGame";
import Challenge from "./components/Challenge";

import PrivateRoute from "./utilities/PrivateRoute";

const MainWrapper = styled.div`
  max-width: 1140px;
  padding: 15px;
  margin: auto;
`;

function App() {
  const { ready } = useTranslation();

  // console.log(process.env.REACT_APP_KEYCLOAK_CLIENT_ID);
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <>
            <MainLoading />
            <Navbar />
            <MainWrapper>
              <AnimatePresence exitBeforeEnter initial={false}>
                <Switch location={location} key={location.pathname}>
                  <Route exact path="/" component={Homepage} />
                  <PrivateRoute
                    exact
                    path="/profile"
                    roles={["student", "teacher"]}
                    component={Profile}
                  />
                  <PrivateRoute
                    exact
                    path="/profile/game"
                    roles={["student"]}
                    component={ProfileInGame}
                  />
                  <PrivateRoute
                    exact
                    path="/profile/game/challenge"
                    roles={["student"]}
                    component={Challenge}
                  />
                </Switch>
              </AnimatePresence>
            </MainWrapper>
          </>
        )}
      />
    </BrowserRouter>
    // {/* <h2>{t("title")}</h2>
    //   <p>{t("description.part1")}</p>
    //   <p>{t("description.part2")}</p>

    //   <button
    //     onClick={() => {
    //       i18n.changeLanguage("pl");
    //     }}
    //   >
    //     Polski
    //   </button>
    //   <button
    //     onClick={() => {
    //       i18n.changeLanguage("en");
    //     }}
    //   >
    //     English
    //   </button> */}
  );
}

export default App;
