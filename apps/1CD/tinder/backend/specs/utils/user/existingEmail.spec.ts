import { GraphQLError } from 'graphql';
import { userModel } from '../../../src/models';
import { checkExistingEmail } from '../../../src/utils/user/check-existing-email';

jest.mock('../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
  },
}));

describe('checkExistingEmail', () => {
  it('should return email if email is possible to', async () => {
    const mockEmail = 'cypress@gmail.com';
    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await checkExistingEmail(mockEmail);
        expect(res).toBe(mockEmail);
  });

  it('should throw graphqlError when email already exists', async () => {
    const mockEmail = 'test@gmail.com';
    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: mockEmail,
    });
    await expect(checkExistingEmail(mockEmail)).rejects.toThrowError(GraphQLError);
    await expect(checkExistingEmail(mockEmail)).rejects.toMatchObject({
        extensions:{
            code:'USER_ALREADY_EXISTS'
        }
    })
  });

  it('should throw graphql error when email is not provided', async()=>{
    const mockEmail='';

    await expect(checkExistingEmail(mockEmail)).rejects.toThrow(GraphQLError);
    await expect(checkExistingEmail(mockEmail)).rejects.toThrow('email is required');
  });


});
