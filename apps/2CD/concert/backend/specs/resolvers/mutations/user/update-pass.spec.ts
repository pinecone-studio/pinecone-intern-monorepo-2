import { GraphQLResolveInfo } from 'graphql';
import { userModel } from 'src/models';
import { updatePass } from 'src/resolvers/mutations';
import { updatePassZod } from 'src/zodSchemas/user.zod';
import { Response } from 'src/generated';

jest.mock('src/models', () => ({
  userModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));
const mockInput = { id: '123', password: '1234' };
describe('update user own password', () => {
  it('if user id not exist throw user not found error', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    await expect(updatePass!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo)).rejects.toThrow('User not found');
  });
  it('if id value empty string ,throw id is required error', () => {
    expect(() => updatePassZod.parse({ ...mockInput, id: '' })).toThrow('Id is required');
  });
  it('if password empty , throw password is required error', () => {
    expect(() => updatePassZod.parse({ ...mockInput, password: '' })).toThrow('Password is required');
  });
  it('successfully update user password', async () => {
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(mockInput);
    const result = await updatePass!({}, { input: mockInput }, {}, {} as GraphQLResolveInfo);
    expect(userModel.findByIdAndUpdate).toBeCalled();
    expect(result).toBe(Response.Success);
  });
});
