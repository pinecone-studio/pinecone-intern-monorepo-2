import { createPassword } from '../../../../src/resolvers/mutations';
import { userModel } from '../../../../src/models';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe('create password of user', () => {
  const mockEmail = 'cypress@gmail.com';
  const mockPassword = 'Tinder1213@';
  const info = {} as GraphQLResolveInfo;
  const userId='675675e84bd85fce3de34006'
  it('should return when user create the password successfully', async () => {
    const input = {password: mockPassword };
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
      email: mockEmail,
    });
    const res = await createPassword!({}, { input }, {userId}, info);
    expect(res).toEqual({
        email: mockEmail,
      });
  });
  it('should throw error when password is empty', async () => {
    await expect(createPassword!({}, { input: {password: '' } }, {userId}, info)).rejects.toThrow(GraphQLError);
    await expect(createPassword!({}, { input: {password: '' } }, {userId}, info)).rejects.toThrow('Password is required. Please enter a password to continue.');
  });

  it('should throw error if the user is empty',async()=>{
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(createPassword!({},{input:{password:mockPassword}},{userId},info)).rejects.toThrow(GraphQLError);
    await expect(createPassword!({},{input:{password:mockPassword}},{userId},info)).rejects.toThrow('User not found. Please check if the username or email is correct.');
  })
});
