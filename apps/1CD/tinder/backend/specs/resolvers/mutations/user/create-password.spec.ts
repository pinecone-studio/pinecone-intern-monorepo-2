import { createPassword } from 'apps/1CD/tinder/backend/src/resolvers/mutations';
import { userModel } from '../../../../src/models';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('create password of user', () => {
  const mockEmail = 'test@gmail.com';
  const mockPassword = 'test';
  const info = {} as GraphQLResolveInfo;
  it('should return when user create the password successfully', async () => {
    const input = { email: mockEmail, password: mockPassword };
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
      email: mockEmail,
    });
    const res = await createPassword!({}, { input }, {}, info);
    expect(res).toEqual({
        email: mockEmail,
      });
  });
  it('should throw error when password is empty', async () => {
    await expect(createPassword!({}, { input: { email:mockEmail, password: '' } }, {}, info)).rejects.toThrow(GraphQLError);
    await expect(createPassword!({}, { input: { email:mockEmail, password: '' } }, {}, info)).rejects.toThrow('email and pass are required');
  });
  it('should throw error when email is empty',async()=>{
    await expect(createPassword!({},{input:{email:'',password:mockPassword}},{},info)).rejects.toThrow(GraphQLError);
    await expect(createPassword!({}, { input: { email:'', password:mockPassword } },{},info)).rejects.toThrow('email and pass are required');
  })

  it('should throw error if the user is empty',async()=>{
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(createPassword!({},{input:{email:'example@gmail.com',password:mockPassword}},{},info)).rejects.toThrow(GraphQLError);
    await expect(createPassword!({},{input:{email:'example@gmail.com',password:mockPassword}},{},info)).rejects.toThrow('user not found');
  })
});
