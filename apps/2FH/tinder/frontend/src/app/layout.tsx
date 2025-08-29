import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';

export const metadata = {
  title: '@tinder - Sign Up',
  description: 'Create your Tinder profile and start swiping',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
       <ApolloWrapper>
        {children}
       </ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
