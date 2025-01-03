import { getMatchedUser } from "../../../../src/resolvers/queries";
import {  userModel } from "../../../../src/models";
import { GraphQLError, GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/user/user.model',()=>({
    userModel:{
        findById:jest.fn()
    }
}));
describe('should test matched user query',()=>{
     const mockInfo = {} as GraphQLResolveInfo;
     const mockUser1={
        photos:['photo','photo2'],
        name:'mock',
        id:'1234'
    };
    const mockUser2={
        photos:['photo','photo2'],
        id:'5678',

    };
    it('should successfully return data',async()=>{
       

        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser1);
        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser2);
        const result = await getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo);
        expect(result).toEqual({
            swipedUserImg:mockUser1.photos[0],
            userImg:mockUser2.photos[0],
            swipedName:mockUser1.name
        })

    });
    it('should throw new error',async()=>{
        (userModel.findById as jest.Mock).mockResolvedValue(null);
        expect( getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo)).rejects.toThrow(GraphQLError);
        expect( getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo)).rejects.toThrow('database error in getUser in matching');
        
    })
})