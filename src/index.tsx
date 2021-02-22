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
  split,
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

import MainLoading from "./components/MainLoading";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import ClearLocalStorage from "./utilities/ClearLocalStorage";

ClearLocalStorage();

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WS,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
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
                authorization: token ? `bearer ${token}` : "",
              },
            };
          })
          .catch(function () {
            console.log(
              "Failed to refresh the token, or the session has expired"
            );
          });
      } else {
        return {
          headers: {
            authorization: token ? `bearer ${token}` : "",
          },
        };
      }

      // return {
      //   headers: {
      //     authorization: `bearer ${keycloak.token}`,
      //   },
      // };
    },
  },
});

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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
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
        LoadingComponent={<MainLoading />}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ReactKeycloakProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
