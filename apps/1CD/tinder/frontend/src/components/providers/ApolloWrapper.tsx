'use client';

import { HttpLink } from '@apollo/client';
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { ReactNode } from 'react';
import { setContext } from '@apollo/client/link/context';

const uri =process.env.LOCAL_BACKEND_URI || process.env.BACKEND_URI;
interface ApolloWrapperProps {
  children: ReactNode;
  authToken: string;
}


const makeClient = (authToken:string) => {
  const httpLink = new HttpLink({
    uri,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}`:'',
      },
    };
  });
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
};


export const ApolloWrapper = ({ children, authToken }: ApolloWrapperProps) => {
  return <ApolloNextAppProvider makeClient={()=>makeClient(authToken)}>{children}</ApolloNextAppProvider>;
};

