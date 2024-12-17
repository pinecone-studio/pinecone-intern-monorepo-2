import { GET_MATCHEDUSERS } from '@/graphql/chatgraphql';
import { useQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type Matchcontexttype = {
  matchedData:any[]
};
const Matchcontext = createContext<Matchcontexttype>({} as Matchcontexttype);
export const MatchProvider = ({ children }: PropsWithChildren) => {
  const { loading, error, data, refetch } = useQuery(GET_MATCHEDUSERS, {
    variables:{
      input:{
        _id:'6747bf86eef691c549c23463'
      }
    }
  }
  );
  const matchedData = data?.getMatch
  return <Matchcontext.Provider value={{ matchedData }}>{children}</Matchcontext.Provider>;
};

export const useMatchedUsersContext = () => useContext(Matchcontext);
