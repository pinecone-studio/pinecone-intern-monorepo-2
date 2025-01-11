import { getMatchedUser } from "../../../../src/resolvers/queries";
import {  Matchmodel, userModel } from "../../../../src/models";
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/user/user.model',()=>({
    userModel:{
        findById:jest.fn()
    },
    Matchmodel:{
        find:jest.fn()
    }
}));
beforeEach(() => {
    jest.clearAllMocks();
  });
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
        (Matchmodel.find as jest.Mock).mockResolvedValueOnce({user1:mockUser1.id, user2:mockUser2.id,matched:'true'});
        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser1);
        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser2);
        const result = await getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo);
        expect(result).toEqual({
            swipedUserImg:mockUser1.photos[0],
            userImg:mockUser2.photos[0],
            swipedName:mockUser1.name
        })

    });
    it('should successfully return data',async()=>{
        (Matchmodel.find as jest.Mock).mockResolvedValueOnce({user1:mockUser1.id, user2:mockUser2.id,matched:'true'});
        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser1);
        (userModel.findById as jest.Mock).mockResolvedValueOnce(mockUser2);
        const result = await getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo);
        expect(result).toEqual({
            swipedUserImg:mockUser1.photos[0],
            userImg:mockUser2.photos[0],
            swipedName:mockUser1.name
        })

    });
    
    it('should successfully return data',async()=>{
        (Matchmodel.find as jest.Mock).mockResolvedValueOnce(null);
        const result = await getMatchedUser!({}, { matchedUser:mockUser1.id }, {userId:mockUser2.id}, mockInfo);
        expect(result).toEqual({
            swipedUserImg:null,
            userImg:null,
            swipedName:null
        })

    });
})