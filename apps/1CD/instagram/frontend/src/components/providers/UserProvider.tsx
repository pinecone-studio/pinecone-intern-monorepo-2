'use client';
import { SearchUsersDocument, SearchUsersQuery, SearchUsersQueryVariables, SendFollowReqMutation, useSendFollowReqMutation } from '@/generated';
import { ApolloError, FetchResult, MutationFunctionOptions, useLazyQuery } from '@apollo/client';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type UserContextType = {
  searchHandleChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  setSearchTerm: (_searchTerm: string) => void;
  data: SearchUsersQuery | undefined;
  loading: boolean;
  refresh: () => void;
  sendFollowReq: (_options?: MutationFunctionOptions<SendFollowReqMutation, { followerId: string; followingId: string }>) => Promise<FetchResult<SendFollowReqMutation>>;
  followLoading: boolean;
  followError: ApolloError | undefined;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUsers, { data, loading, refetch }] = useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument);


  const refresh = async () => {
    await refetch();
  };

  const searchHandleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (searchTerm.trim()) {
      searchUsers({ variables: { searchTerm } });
    }
    await refresh();
  };

  const [sendFollowReq, { loading: followLoading, error: followError }] = useSendFollowReqMutation();

  return <UserContext.Provider value={{ searchHandleChange, searchTerm, setSearchTerm, data, loading, refresh, sendFollowReq, followLoading, followError }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
