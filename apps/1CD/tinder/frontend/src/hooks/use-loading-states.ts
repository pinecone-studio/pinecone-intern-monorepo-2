import { useMatchedUsersContext } from "@/components/providers/MatchProvider";
import { useOneUserContext } from "@/components/providers/OneuserProvider";
import { GET_CHAT } from "@/graphql/chatgraphql";
import { useQuery } from "@apollo/client";

export const useLoadingstates =(user2:string)=>{
    const { matchedData, matchloading, refetchmatch, matcherror } = useMatchedUsersContext();
    const { oneUserloading } = useOneUserContext();
    const { loading, error, data, refetch } = useQuery(GET_CHAT, {
        variables: {
          input: {
            user2: user2,
          },
        },
        pollInterval: 5000
      });
    const chatloading = oneUserloading || loading;
    const response = data?.getChat;
    const pageloading = matchloading || chatloading;
    const errormessage = error?.message;
    return { chatloading, response, pageloading, errormessage,matchedData, refetchmatch, matcherror,  refetch, loading}
}