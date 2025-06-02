import { GraphQLResolveInfo } from 'graphql';
import { userModel } from 'src/models';
import { updateUser } from 'src/resolvers/mutations';
import { updateUserZod } from 'src/zodSchemas/user.zod';
import { Response } from 'src/generated';

jest.mock('src/models', () => ({
  userModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));
const mockInput = { id: '123', phone: '12345678' };
describe('update user info', () => {
  it('if id is not exist throw id is required error', () => {
    expect(() => updateUserZod.parse({ id: '' })).toThrow('Id is required');
  });
  it('if user id not exist throw user not found error', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    await expect(updateUser!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('User not found');
  });
  it('if email registered throw error Email exist enter other email.', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValueOnce(mockInput);
    await expect(updateUser!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('Email exist enter other email.');
  });
  it('successfully updated user info', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(mockInput);
    const result = await updateUser!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo);
    expect(userModel.findOne).toBeCalled();
    expect(userModel.findByIdAndUpdate).toBeCalled();
    expect(result).toBe(Response.Success);
  });
});
