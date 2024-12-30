import React, { PropsWithChildren } from 'react';

export const Container = ({ children }: PropsWithChildren) => {
  return (
    <div data-cy="Container" className="container  m-auto">
      {children}
    </div>
  );
};
