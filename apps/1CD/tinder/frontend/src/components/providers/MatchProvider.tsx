'use client'
import { GET_MATCHEDUSERS } from '@/graphql/chatgraphql';
import { useQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext} from 'react';

type Matchcontexttype = {
  matchedData:any[]
  refetchmatch:any
  matchloading:boolean
};
const Matchcontext = createContext<Matchcontexttype>({} as Matchcontexttype);
export const MatchProvider = ({ children }: PropsWithChildren) => {
  const {data, refetch, loading } = useQuery(GET_MATCHEDUSERS, {
    variables:{
      input:{
        _id:'6747be56eef691c549c23461'
      }
    }
  }
  );
  const matchedData = data?.getMatch
  const matchloading = loading
  const refetchmatch = ()=>{
    refetch()
  }
  return <Matchcontext.Provider value={{ matchedData,refetchmatch, matchloading}}>{children}</Matchcontext.Provider>;
};

export const useMatchedUsersContext = () => useContext(Matchcontext);
