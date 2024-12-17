// 'use client';
// import { SearchUsersDocument, SearchUsersQuery, SearchUsersQueryVariables } from '@/generated';
// import { useLazyQuery } from '@apollo/client';
// import { createContext, PropsWithChildren, useContext, useState } from 'react';

// type AuthContextType = {
//   searchHandleChange: (_e:React.ChangeEvent<HTMLInputElement>) => void;
//   searchTerm: string;
//   setSearchTerm: (_searchTerm: string) => void;
//   data: SearchUsersQuery | undefined;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: PropsWithChildren) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchUsers, { data, loading, refetch }] = useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument);

//   const refresh = async () => {
//     await refetch();
//   };

//   const searchHandleChange = async (e:) => {
//     setSearchTerm(e.target.value);
//     if (searchTerm.trim()) {
//       searchUsers({ variables: { searchTerm } });
//     }
//     await refresh;
//   };

//   //   console.log('data', searchTerm);
//   //   console.log('loading', loading);

//   return <AuthContext.Provider value={{ searchHandleChange, searchTerm, setSearchTerm, data, loading }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
