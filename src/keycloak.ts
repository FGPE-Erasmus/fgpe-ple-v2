import Keycloak from "keycloak-js";

const keycloakConfig: Keycloak.KeycloakConfig = {
  url: "http://localhost:10001/auth",
  realm: "FGPE",
  clientId: "fgpe-learning-platform",
};

const keycloak = new (Keycloak as any)(keycloakConfig);
export default keycloak;
