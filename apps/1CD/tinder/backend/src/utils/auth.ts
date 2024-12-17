import { GraphQLError } from "graphql"
import { Context } from "../types"

export const authorization=(mutation:any)=>{
    return async(_:any,args:any,{userId}:Context,info:any)=>{
        console.log(userId)
        if(!userId){
            throw new GraphQLError('Unauthorized',{
                extensions: {
                    code: 'FORBIDDEN',
                  },
            })
        }
        return mutation(_,args,{userId},info);
    }
}