import Keycloak from "keycloak-js";

const keycloakConfig: Keycloak.KeycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
};

const keycloak = new (Keycloak as any)(keycloakConfig);
export default keycloak;
