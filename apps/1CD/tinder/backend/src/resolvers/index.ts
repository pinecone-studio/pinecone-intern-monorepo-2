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
  },
  Query,
};
