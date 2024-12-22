import { useMatchedUsersContext } from '@/components/providers/MatchProvider';
import { useOneUserContext } from '@/components/providers/OneuserProvider';
import { useQuery } from '@apollo/client';
import { GET_CHAT } from '@/graphql/chatgraphql';

export const useChatLogic = (user2: string) => {
  const { matchloading, refetchmatch, matcherror} = useMatchedUsersContext();
  const { oneUserloading } = useOneUserContext();

  const { loading, error, data, refetch } = useQuery(GET_CHAT, {
    variables: {
      input: {
        user2,
      },
    },
  });

  const chatloading = oneUserloading || loading;
  const response = data?.getChat;
  const pageloading = matchloading || oneUserloading || loading;
  const errormessage = error?.message;

  return {
    chatloading,
    response,
    pageloading,
    errormessage,
    refetch,
    refetchmatch,
    matcherror
  };
};
