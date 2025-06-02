'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';

const uri = process.env.BACKEND_URI ?? 'http://localhost:4200/api/graphql';

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
