import React from 'react';
import ProImg from '@/components/user-profile/ChangeProImg';
import { fireEvent, render, screen, act } from '@testing-library/react';

describe('ProImg component', () => {
  const changeProfileImg = jest.fn();
  const setProImgData = jest.fn();
  it('Should render the component with prev profile image', async () => {
    render(
      <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="userID" prevProImg="http://www.example.com/prevproimg.jpg" />
    );
  });
  it('Should handle upload image', async () => {
    render(
      <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="userID" prevProImg="http://www.example.com/prevproimg.jpg" />
    );

    global.fetch = jest.fn().mockResolvedValue({ ok: jest.fn().mockResolvedValue(true), json: jest.fn().mockResolvedValue('http://www.example.com/newproimg.jpg') });
    fireEvent.click(screen.getByTestId('proImage'));
    const proImgInput = screen.getByTestId('inputImage') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'test-image.jpg', { type: 'image/jpg' });
    await act(async () => {
      fireEvent.change(proImgInput, { target: { files: [file] } });
    });

    // await waitFor(() => {
    //   expect(changeProfileImg).calledWith({ _id: 'userID', profileImg: 'http://www.example.com/newproimg.jpg' });
    // });
  });

  it('Should do nothing when no file uploaded', () => {
    render(
      <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="userID" prevProImg="http://www.example.com/prevproimg.jpg" />
    );
    const proImgInput = screen.getByTestId('inputImage') as HTMLInputElement;

    fireEvent.change(proImgInput, { target: { files: [] } });
  });
});
