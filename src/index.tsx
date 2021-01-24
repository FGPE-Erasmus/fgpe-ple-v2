import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/theme/themes";
import GlobalStyle from "./styles/GlobalStyle";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import { setContext } from "@apollo/client/link/context";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import {
  ChakraProvider,
  ColorModeScript,
  localStorageManager,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = keycloak.token;
  if (keycloak.isTokenExpired()) {
    keycloak
      .updateToken(1)
      .then(function (refreshed: boolean) {
        if (refreshed) {
          console.log("Token was successfully refreshed");
        } else {
          console.log("Token is still valid");
        }
        return {
          headers: {
            ...headers,
            Authorization: token ? `bearer ${token}` : "",
          },
        };
      })
      .catch(function () {
        console.log("Failed to refresh the token, or the session has expired");
      });
  } else {
    return {
      headers: {
        ...headers,
        Authorization: token ? `bearer ${token}` : "",
      },
    };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

keycloak.onTokenExpired = () => {
  console.log("expired " + new Date());
  keycloak
    .updateToken(50)
    .success((refreshed: boolean) => {
      if (refreshed) {
        console.log("refreshed " + new Date());
      } else {
        console.log("not refreshed " + new Date());
      }
    })
    .error(() => {
      console.error("Failed to refresh token " + new Date());
    });
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
      {/* <GlobalStyle /> */}

      <ColorModeScript initialColorMode={theme.config.lightTheme} />
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: "check-sso",
        }}
        LoadingComponent={<span>loading</span>}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ReactKeycloakProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
