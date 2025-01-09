import { updateUserRole } from "../../../../src/resolvers/mutations/auth/update-user-role";
import User from "../../../../src/models/user.model";
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/user.model', ()=>({
    findOne:jest.fn(),
}));

describe('update users role', ()=>{
    it('should update user role', async()=>{
        const mockUser={
            email:'test@gmail.com',
            role:'user',
            save:jest.fn().mockResolvedValueOnce({
                email:'test@gmail.com',
                role:'admin',
            }),
        };
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    
        const result=await updateUserRole!({}, {input: {email:'test@gmail.com', role: 'admin'}}, {userId:null}, {} as GraphQLResolveInfo);

        expect(result).toEqual(mockUser);
        expect(mockUser.save).toHaveBeenCalled();
    });
   it('should throw an error if user is not found', async()=>{
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    try {
        await updateUserRole!({}, {input: {email:'ttest@gmail.com', role:'admin'}}, {userId:null}, {} as GraphQLResolveInfo);
    } catch (error) {
        expect(error).toEqual(new Error('User not found'));
    }
   });
});