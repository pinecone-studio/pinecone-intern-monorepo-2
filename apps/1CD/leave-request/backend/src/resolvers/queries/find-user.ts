import { QueryResolvers } from "../../generated";
import { UserModel } from "../../models/user";

export const findUserByEmail: QueryResolvers['findUserByEmail'] = (_,{email}) => {
    const user = UserModel.findOne({email})
    return user
};
