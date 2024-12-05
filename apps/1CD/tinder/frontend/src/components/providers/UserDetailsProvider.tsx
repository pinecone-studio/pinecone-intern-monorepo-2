'use client';

import { PropsWithChildren, createContext, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/Userdetailsgraphql';

type UserDetailsInput = {
  variables:{
    _id: string;
    name: string;
    bio: string;
    profession: string;
    schoolWork: string[];
    interests: string[];
  }
};

type UserDetailsContextType = {
  updateUser: (_variables: UserDetailsInput) => void;
};

const UserDetailsContext = createContext<UserDetailsContextType>({} as UserDetailsContextType);

export const UserDetailsProvider = ({ children }: PropsWithChildren) => {
  const [updateUserMutation] = useMutation(UPDATE_USER);

  const updateUser = async ({variables:{ _id, name, bio, profession, schoolWork, interests }}: UserDetailsInput) => {
    try {
      await updateUserMutation({
        variables: {
          id: _id,           
          name,              
          bio,              
          profession,       
          schoolWork,       
          interests         
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <UserDetailsContext.Provider value={{ updateUser }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUseDetails = () => useContext(UserDetailsContext);
