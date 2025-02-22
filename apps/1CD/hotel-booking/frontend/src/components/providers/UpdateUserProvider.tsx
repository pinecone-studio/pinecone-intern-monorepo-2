/* eslint-disable-max-line */
'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { UpdateContextType, UpdateParams } from './types/UpdateTypes';
import { Response, useUpdateProfileMutation } from '@/generated';
import { toast } from 'react-toastify';

import { useAuth } from './AuthProvider';

const UpdateContext = createContext<UpdateContextType>({} as UpdateContextType);

export const UpdateProvider = ({ children }: PropsWithChildren) => {
  const [updateProfile] = useUpdateProfileMutation();
  const { setUser } = useAuth();

  const updateProfileData = async ({ firstName, lastName, dateOfBirth, phoneNumber, emergencyContact, emergencyStatus }: UpdateParams) => {
    await updateProfile({
      variables: {
        input: {
          firstName,
          lastName,
          dateOfBirth,
          phoneNumber,
          emergencyContact,
          emergencyStatus,
        },
      },
      onCompleted: (data) => {
        toast.success(Response.Success);
        setUser(data.updateProfile);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return <UpdateContext.Provider value={{ updateProfileData }}>{children}</UpdateContext.Provider>;
};

export const useUpdateProfile = () => useContext(UpdateContext);
