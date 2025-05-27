import { PropsWithChildren } from 'react';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <h1>Home Layout</h1>
      {children}
    </div>
  );
};

export default RootLayout;
