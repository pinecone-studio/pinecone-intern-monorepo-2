import { PropsWithChildren } from 'react';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default RootLayout;
