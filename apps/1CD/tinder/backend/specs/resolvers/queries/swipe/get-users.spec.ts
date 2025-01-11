import { GraphQLResolveInfo } from 'graphql';
import { userModel } from '../../../../src/models';
import { getUsers } from '../../../../src/resolvers/queries';


jest.mock('../../../../src/models', () => ({
  userModel: {
    find: jest.fn(),
    findById: jest.fn(),
  },
}));

describe('should return user', () => {
//   const users = [
//     {
//       _id: '123',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//       gender: 'both',
//     },
//     {
//       _id: '1234',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//       gender: 'both',
//     },
//     {
//       _id: '12345',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//      gender: 'female',
//     },
//   ];
//   const users1 = [
//     {
//       _id: '123',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//       gender: 'male',
//     },
//     {
//       _id: '1234',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//       gender: 'male',
//     },
//     {
//       _id: '12345',
//       name: 'user1',
//       email: 'cypress@gmail.com',
//       photos: 'jjjj',
//       gender:'male'
//     },
//   ];
//   const user = {
//     _id: '12345',
//     name: 'user1',
//     email: 'cypress@gmail.com',
//     photos: 'jjjj',
//     attraction:'both'
//   };
//   const user1 = {
//     _id: '12345',
//     name: 'user1',
//     email: 'cypress@gmail.com',
//     photos: 'jjjj',
//     attraction:'male'
//   };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully return users with attraction both', async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce({ attraction: 'both' });
    (userModel.find as jest.Mock).mockResolvedValueOnce([{
        _id: '123',
        name: 'user1',
        email: ""
    }]);
    const res = await getUsers!({}, {}, { userId: '675675e84bd85fce3de34006' }, {} as GraphQLResolveInfo);
    expect(res).toEqual([{ _id: '123', name: 'user1', email: "" }]);
  });
  it('should return user if user attract to female',async () => {
    (userModel.findById as jest.Mock).mockResolvedValueOnce({ attraction:""});
    (userModel.find as jest.Mock).mockResolvedValueOnce([{
        _id: '123',
        name: 'user1',
        email: "",
        
    }]);
    const res = await getUsers!({}, {}, { userId: '675675e84bd85fce3de34006' }, {} as GraphQLResolveInfo);
    expect(res).toEqual([{ _id: '123', name: 'user1', email: "" }]);
  });

});
