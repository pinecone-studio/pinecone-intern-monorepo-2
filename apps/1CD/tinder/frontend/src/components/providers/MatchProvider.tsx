'use client';
import { GET_MATCHEDUSERS } from '@/graphql/chatgraphql';
import { useQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext } from 'react';
type User = {
  _id: string;
  hasChatted: boolean;
  photos: string[];
  name: string;
  profession: string;
  age: number;
};
type Matchcontexttype = {
  matchedData: User[];
  refetchmatch: any;
  matchloading: boolean;
  matcherror: any;
};
const Matchcontext = createContext<Matchcontexttype>({} as Matchcontexttype);
export const MatchProvider = ({ children }: PropsWithChildren) => {
  const { data, refetch, loading, error } = useQuery(GET_MATCHEDUSERS);
  const matchedData = data?.getMatch;
  const matchloading = loading;
  const matcherror = error;
  const refetchmatch = () => {
    refetch();
  };
  return <Matchcontext.Provider value={{ matchedData, refetchmatch, matchloading, matcherror }}>{children}</Matchcontext.Provider>;
};

export const useMatchedUsersContext = () => useContext(Matchcontext);
