import React, { useState } from "react";
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
// import MainLoading from "./components/MainLoading";
import ProfileInGame from "./components/ProfileInGame";
import Challenge from "./components/Challenge";
import PrivateRoute from "./utilities/PrivateRoute";

import NavContext from "./context/NavContext";

const MainWrapper = styled.div`
  max-width: 1140px;
  padding: 15px;
  margin: auto;
`;

function App() {
  const { ready } = useTranslation();
  const [activeChallenge, setActiveChallenge] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activeGame, setActiveGame] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // console.log(process.env.REACT_APP_KEYCLOAK_CLIENT_ID);
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <>
            {/* <MainLoading /> */}
            <NavContext.Provider
              value={{
                activeChallenge: activeChallenge,
                setActiveChallenge: setActiveChallenge,
                activeGame: activeGame,
                setActiveGame: setActiveGame,
              }}
            >
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
                      path="/game/:gameId"
                      roles={["student"]}
                      component={ProfileInGame}
                    />
                    <PrivateRoute
                      exact
                      path="/game/:gameId/challenge/:challengeId"
                      roles={["student"]}
                      component={Challenge}
                    />

                    {/* <PrivateRoute
                      exact
                      path="/profile/game/challenge"
                      roles={["student"]}
                      component={Challenge}
                    /> */}
                  </Switch>
                </AnimatePresence>
              </MainWrapper>
            </NavContext.Provider>
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
