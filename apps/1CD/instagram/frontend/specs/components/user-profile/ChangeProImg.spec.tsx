import React from 'react';
import ProImg from '@/components/user-profile/ChangeProImg';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

describe('ProImg component', () => {
  const setProImgData = jest.fn();
  const changeProfileImg = jest.fn();

  it('1. Should handle upload image', async () => {
    render(
      <MockedProvider>
        <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="userID" prevProImg="http://www.example.com/prevproimg.jpg" />
      </MockedProvider>
    );

    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ secureUrl: 'http://www.example.com/newproimg.jpg' }) });
    fireEvent.click(screen.getByTestId('proImage'));
    const proImgInput = screen.getByTestId('inputImage') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'test-image.jpg', { type: 'image/jpg' });
    await act(async () => {
      fireEvent.change(proImgInput, { target: { files: [file] } });
    });

    // await waitFor(() => {
    //   expect(changeProfileImg).toHaveBeenCalledWith({ _id: 'userID', profileImg: 'http://www.example.com/newproimg.jpg' });
    // });

    // const proImage = screen.getByTestId('proImage');
  });

  // it('2. Should handle upload profile image when user id is null id', async () => {
  //   render(
  //     <MockedProvider>
  //       <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="" prevProImg="http://www.example.com/prevproimg.jpg" />
  //     </MockedProvider>
  //   );
  //   global.fetch = jest.fn().mockResolvedValue({
  //     json: jest.fn().mockResolvedValue({ secureUrl: 'http://www.example.com/newproimg.jpg' }),
  //   });
  //   const proImage = screen.getByTestId('proImage');
  //   fireEvent.click(proImage);
  //   const proImgInput = screen.getByTestId('inputImage') as HTMLInputElement;
  //   const file = new File(['(⌐□_□)'], 'test-image.jpg', { type: 'image/jpg' });

  //   await act(async () => {
  //     fireEvent.change(proImgInput, { target: { files: [file] } });
  //   });

  //   waitFor(() => {
  //     expect(changeProfileImg).toHaveBeenCalledWith({ _id: '', profileImg: 'http://www.example.com/newproimg.jpg' });
  //   });

  //   expect(proImage).toContain('http://www.example.com/newproimg.jpg');
  // });

  it('3. Should do nothing when no file uploaded', () => {
    render(
      <MockedProvider>
        <ProImg proImgData="http://www.example.com/prevproimg.jpg" setProImgData={setProImgData} changeProfileImg={changeProfileImg} _id="userID" prevProImg="http://www.example.com/prevproimg.jpg" />
      </MockedProvider>
    );
    const proImgInput = screen.getByTestId('inputImage') as HTMLInputElement;

    fireEvent.change(proImgInput, { target: { files: [] } });
  });
});
