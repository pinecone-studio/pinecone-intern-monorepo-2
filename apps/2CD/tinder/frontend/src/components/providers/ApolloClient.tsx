'use client';

import { PropsWithChildren } from 'react';
import { ApolloWrapper } from './ApolloWrapper';

export default function ApolloProviderClient({ children }: PropsWithChildren) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
}
