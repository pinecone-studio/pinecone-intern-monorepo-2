'use client';

import { PropsWithChildren } from 'react';
import { ApolloWrapper } from './ApolloWrapper';


const  ApolloProviderClient = ({ children }: PropsWithChildren) => {
  return <ApolloWrapper>{children}</ApolloWrapper>;
}

export default ApolloProviderClient;