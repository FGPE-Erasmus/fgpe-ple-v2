import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { themes } from "./styles/theme/themes";
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

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  const token = keycloak.token;

  return {
    headers: {
      ...headers,
      Authorization: token ? `bearer ${token}` : "",
    },
  };
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
    <ThemeProvider theme={true ? themes.light : themes.dark}>
      <GlobalStyle />
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: "check-sso",
        }}
        LoadingComponent={<div>loading</div>}
      >
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ReactKeycloakProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
