'use client';
import { GET_ONEUSER } from '@/graphql/chatgraphql';
import { useQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useParams } from 'next/navigation';

type Oneusercontexttype = {
  oneUser: any;
  oneUserloading: boolean;
  id: any;
  oneusererror: any;
};
const Oneusercontext = createContext<Oneusercontexttype>({} as Oneusercontexttype);
export const OneUserProvider = ({ children }: PropsWithChildren) => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { data, loading, error } = useQuery(GET_ONEUSER, {
    variables: {
      input: {
        _id: id,
      },
    },
  });
  const oneUser = data?.getOneUser;
  const oneUserloading = loading;
  const oneusererror = error;

  return <Oneusercontext.Provider value={{ oneUser, oneUserloading, id, oneusererror }}>{children}</Oneusercontext.Provider>;
};

export const useOneUserContext = () => useContext(Oneusercontext);
