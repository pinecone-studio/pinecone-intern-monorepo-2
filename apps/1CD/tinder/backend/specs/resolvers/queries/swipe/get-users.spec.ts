import { userModel } from "../../../../src/models";
import { getUsers } from "../../../../src/resolvers/queries";
import { GraphQLError, GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models',()=>({
    userModel:{
        find:jest.fn()
    }
}));

describe('should return user',()=>{
    const users=[
        {
            _id:'123',
            name:'user1',
            email:'cypress@gmail.com',
            photos:'jjjj',
        },
        {
            _id:'1234',
            name:'user1',
            email:'cypress@gmail.com',
            photos:'jjjj',
        },
        {
            _id:'12345',
            name:'user1',
            email:'cypress@gmail.com',
            photos:'jjjj',
        }
    ];
    beforeEach(()=>{
        jest.clearAllMocks()
    })
    it('should successfully return users',async()=>{
        (userModel.find as jest.Mock).mockResolvedValue(users);
        const res=await getUsers!({},{},{userId:'675675e84bd85fce3de34006'},{} as GraphQLResolveInfo);
        expect(res).toBe(users);
    });
    it('should throw error when users could not found',async()=>{
        (userModel.find as jest.Mock).mockRejectedValue(null);
        await expect(getUsers!({},{},{userId:'675675e84bd85fce3de34006'},{} as GraphQLResolveInfo)).rejects.toThrow(GraphQLError);
        await expect(getUsers!({},{},{userId:'675675e84bd85fce3de34006'},{} as GraphQLResolveInfo)).rejects.toThrow('could not find the users');
    })
})