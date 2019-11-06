import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from '@apollo/react-hooks';
import UsersPane from './components/UsersPane'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/typeDefs'
import './index.css'
import '@instructure/canvas-theme'

const cache = new InMemoryCache({addTypename: false});
cache.writeData({
  data: {
    searchFilter: {search_term: '',role_filter_id:'',sort:'',order:'', page: 1},
    errors: null,
    permissions: window.ENV.PERMISSIONS,
    rootAccountId: window.ENV.ROOT_ACCOUNT_ID,
    accountId: window.ENV.ACCOUNT_ID,
    roles: window.ENV.ROLES
  },
});
const link = new HttpLink({ uri: "http://localhost:3001/graphql" });
const client = new ApolloClient({
  cache,
  link,
  resolvers,
  typeDefs
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <UsersPane />
  </ApolloProvider>,
  document.getElementById("root")
);