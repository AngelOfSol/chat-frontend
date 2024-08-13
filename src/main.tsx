import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { ClientOptions, createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import Keycloak, { KeycloakInitOptions } from "keycloak-js";
import { ReactKeycloakProvider } from "@react-keycloak/web";

const container = document.getElementById("root");
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const keycloakConfig = {
  realm: 'chat-app',
  url: 'http://localhost:8090',
  clientId: 'chat-react'
};


const keycloak = new Keycloak(keycloakConfig);

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/graphql'
});


const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/subscriptions',
  connectionParams: () => {
    const token = keycloak.token;
    return {
      // must be captialized for the backend to find it
      Authorization: token ? `Bearer ${token}` : "",
    };
  }
}));


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = keycloak.token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);




const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
loadErrorMessages();
loadDevMessages();


const initOptions: KeycloakInitOptions = { onLoad: "login-required" };

if (container) {
  const root = createRoot(container);

  root.render(
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions} >
      <React.StrictMode>
        <ApolloProvider client={client}>
          <ThemeProvider theme={darkTheme}>
            <Provider store={store}>
              <App />
            </Provider>
          </ThemeProvider>
        </ApolloProvider>
      </React.StrictMode >
    </ReactKeycloakProvider>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
