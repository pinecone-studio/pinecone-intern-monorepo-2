'use client';

import { PropsWithChildren } from 'react';
import { ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache } from '@apollo/experimental-nextjs-app-support/ssr';
import { useClerkId } from '../syncclerkid';
import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const uri = process.env.BACKEND_URI ?? 'http://localhost:4200/api/graphql';

const makeClient = (clerkId: string | null) => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    const updatedHeaders = {
      ...headers,
      clerkid: clerkId,
    };
    return { headers: updatedHeaders };
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: authLink.concat(httpLink),
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  const { clerkId } = useClerkId();

  if (!clerkId) {
    return null;
  }

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(clerkId)}>
      {children}
    </ApolloNextAppProvider>
  );
};
