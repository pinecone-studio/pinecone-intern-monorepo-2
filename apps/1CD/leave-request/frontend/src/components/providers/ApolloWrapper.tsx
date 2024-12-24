'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.LOCAL_BACKEND_URI ?? process.env.BACKEND_URI;

const makeClient = (token: string) => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ?? '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
};

export const ApolloWrapper = ({ children, token }: { children: React.ReactNode; token: string }) => {
  return <ApolloNextAppProvider makeClient={() => makeClient(token)}>{children}</ApolloNextAppProvider>;
};
