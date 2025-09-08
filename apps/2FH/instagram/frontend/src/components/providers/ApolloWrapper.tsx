'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { PropsWithChildren} from 'react';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.NEXT_PUBLIC_BACKEND_URI || 'http://localhost:4200/api/graphql';
// const uri = 'http://localhost:4200/api/graphql';
console.log('GraphQL URI:', uri);

const makeClient = () => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    const authHeader = token ? `Bearer ${token}` : '';
    return {
      headers: {
        ...headers,
        authorization: authHeader,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
