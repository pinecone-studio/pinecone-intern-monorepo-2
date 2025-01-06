'use client';

import React, { createContext, useContext, useState } from 'react';

import { filterProps } from '@/components/supervisor/RequestHeader';
import {  GetAllRequestsBySupervisorQuery, useGetAllRequestsBySupervisorQuery } from '@/generated';


type GetAllContextType = {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    reload: () => void;
    data: GetAllRequestsBySupervisorQuery | undefined;
    loading: boolean
  };
  

export const GetAllContext = createContext<GetAllContextType | undefined>(undefined);

export const GetRequestBySupervisor = ({ children, email, filter }: { children: React.ReactNode; email: string; filter: filterProps }) => {
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useGetAllRequestsBySupervisorQuery({ variables: { supervisorEmail: email, ...filter, page } });

  const reload = () => {
    refetch({ supervisorEmail: email, ...filter, page })
  }

  if (loading){
    return <>loading</>
  }

  return <GetAllContext.Provider value={{page, setPage, reload, data, loading}}>{children}</GetAllContext.Provider>;
};

export const useGetAllRequestSupervisor = (): GetAllContextType => {
    const context = useContext(GetAllContext);
  
    if (!context) {
      throw new Error('useGetAllRequestSupervisor must be used within a data');
    }
  
    return context;
  };