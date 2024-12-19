'use client'
import { GET_ONEUSER } from '@/graphql/chatgraphql';
import { useQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext, useState} from 'react';
import { useParams } from 'next/navigation';

type Oneusercontexttype = {
  oneUser:any
  oneUserloading:boolean
  id:any
};
const Oneusercontext = createContext<Oneusercontexttype>({} as Oneusercontexttype);
export const OneUserProvider = ({ children }: PropsWithChildren) => {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const { data, loading } = useQuery(GET_ONEUSER, {
        variables: {
          input: {
            _id: id,
          },
        },
      });
      const oneUser = data?.getOneUser;
   const oneUserloading = loading
 
  return <Oneusercontext.Provider value={{oneUser,oneUserloading, id}}>{children}</Oneusercontext.Provider>;
};

export const useOneUserContext = () => useContext(Oneusercontext);
