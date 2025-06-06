'use client';

import { PropsWithChildren } from 'react';
import { ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache } from '@apollo/experimental-nextjs-app-support/ssr';
import { useClerkId } from '../syncclerkid';
import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Loading } from '../Loading';
import { useUser } from '@clerk/nextjs';

const uri = process.env.NEXT_PUBLIC_BACKEND_URI ?? 'http://localhost:4200/api/graphql';

const makeClient = (clerkId: string | null) => {
  const httpLink = new HttpLink({
    uri,
    credentials: 'include',
    fetchOptions: {
      mode: 'cors',
    }
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'clerkid': clerkId || '',
      }
    };
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  const { clerkId } = useClerkId();
  const { isLoaded } = useUser();
  
  if (!isLoaded) {
    return <Loading />;
  }

  if (typeof window !== 'undefined') {
    const isAuthPage = window.location.pathname.startsWith('/auth/');
    if (isAuthPage) {
      return <>{children}</>;
    }
  }

  if (!clerkId) {
    window.location.href = '/auth/sign-in';
    return <Loading />;
  }

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(clerkId)}>
      {children}
    </ApolloNextAppProvider>
  );
};
