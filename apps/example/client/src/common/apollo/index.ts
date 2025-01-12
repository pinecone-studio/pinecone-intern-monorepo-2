'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink } from '@apollo/experimental-nextjs-app-support/ssr';

const uri = process.env.API_URL || 'http://localhost:8000/api/graphql';

export const makeApolloClient = () => {
  const httpLink = new HttpLink({
    uri,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
};
