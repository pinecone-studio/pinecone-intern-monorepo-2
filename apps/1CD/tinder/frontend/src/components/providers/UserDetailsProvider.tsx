'use client';

import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/user/Userdetailsgraphql';

type UserDetailsInput = {
  variables: {
    email: string;
    name: string;
    bio: string;
    profession: string;
    schoolWork: string[];
    interests: string[];
  };
};

type UserDetailsContextType = {
  updateUser: (_variables: UserDetailsInput) => void;
  data: any;
  error: any;
  errors:unknown
};

const UserDetailsContext = createContext<UserDetailsContextType>({} as UserDetailsContextType);
export const UserDetailsProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState({});
  const [errors, setErrors] = useState<any>([]);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const updateUser = async ({ variables: { email, name, bio, profession, schoolWork, interests } }: UserDetailsInput) => {
    try {
      const { data, errors } = await updateUserMutation({
        variables: {
          email,
          name,
          bio,
          profession,
          schoolWork,
          interests,
        },
      });
      if (data.updateUser) {
        setData(data.updateUser);
      }
      if(errors){
        setErrors(errors)  
      }
    } catch (error:any) {
      if (error) {
        setError(error);
      }
    }
  };

  return <UserDetailsContext.Provider value={{ updateUser, data, error, errors }}>{children}</UserDetailsContext.Provider>;
};

export const useUseDetails = () => useContext(UserDetailsContext);
