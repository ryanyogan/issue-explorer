import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { InMemoryCache } from 'apollo-cache-inmemory';
import registerServiceWorker from './registerServiceWorker';

import './style.css';
import App from './App';

// TODO: Move to constants dir
const tempUri = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: tempUri,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // This is where we would send errors to tracking software, etc...
    console.log('An error has occured on the GraphQL layer...'); // eslint-disable-line
  }

  if (networkError) {
    // This is where we would send errors to tracking software, etc...
    console.log('Network connectivity issues are present...'); // eslint-disable-line
  }
});

const retryLink = new RetryLink({
  delay: {
    initial: 500,
    max: Infinity,
    jitter: true // randomize initialDecay
  },
  attempts: {
    max: 5,
    retryIf: ({ error }) => !!error
  }
});

const link = ApolloLink.from([errorLink, retryLink, httpLink]);
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();
