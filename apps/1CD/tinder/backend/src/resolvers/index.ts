import { authorization } from '../utils/auth';
import * as Mutation from './mutations';
import * as Query from './queries';

export const resolvers = {
  Mutation:{
    ...Mutation,
    createPassword:authorization(Mutation.createPassword),
    birthdaySubmit:authorization(Mutation.birthdaySubmit),
    updateAttraction:authorization(Mutation.updateAttraction),
    swipeUser:authorization(Mutation.swipeUser),
    createChat:authorization(Mutation.createChat),
    updateMatch:authorization(Mutation.updateMatch),
    imageSubmit:authorization(Mutation.imageSubmit),
    updateUser:authorization(Mutation.updateUser),
    editProfile:authorization(Mutation.editProfile),
    updateGender:authorization(Mutation.updateGender),
  },
  Query:{
    ...Query,
    getUsers:authorization(Query.getUsers),
    getMatchedUser:authorization(Query.getMatchedUser),
    getChat:authorization(Query.getChat),
    getMatch:authorization(Query.getMatch),
    getOneUser:authorization(Query.getOneUser),
    getMe:authorization(Query.getMe),
    
  }
}