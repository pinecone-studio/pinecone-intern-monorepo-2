'use client'
import { useMatchedUsersContext } from '@/components/providers/MatchProvider';

export const useMatch = () => {
  const { matchedData, matchloading, matcherror } = useMatchedUsersContext();
  console.log(matcherror?.message)
  const isEmptyArray = Array.isArray(matchedData) && matchedData.length === 0;
  const haveMatch = matchedData && !isEmptyArray;
  const noMatch = matcherror?.message == 'Error occurred: No matches found' || isEmptyArray;
  return { haveMatch, noMatch, matchloading, matchedData};
};
