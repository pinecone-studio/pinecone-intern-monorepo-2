import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ChangePage } from '@/app/(admin)/_components/ChangePage';
import { usePathname } from 'next/navigation';
describe('', () => {
  it('if click button change page', () => {
    const { getByText } = render(<ChangePage pageName="request" />);
    const button = getByText('Цуцлах хүсэлт');
    const pathName = usePathname();
    expect(pathName).contain('ticket');
    fireEvent.click(button);
    expect(pathName).contain('request');
  });
});
