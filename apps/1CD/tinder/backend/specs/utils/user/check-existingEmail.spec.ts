import { GraphQLError } from "graphql";
import { checkExistingEmail } from "../../../src/utils/user/check-existing-email";


const mockFindOne=jest.fn();

jest.mock('../../../src/models',()=>({
    userModel:{
        findOne: (args:string) => mockFindOne(args) 
    }
}));
describe('checkExistingEmail',()=>{
    beforeEach(() =>{
        mockFindOne.mockClear();
    });
    it('should return email when it doesnt exist in database', async()=>{
        const email='newuser@gmail.com';
        mockFindOne.mockResolvedValue(null);
        const res=await checkExistingEmail(email);
        expect(res).toBe(email);
        expect(mockFindOne).toHaveBeenCalledWith({email});
        expect(mockFindOne).toHaveBeenCalledTimes(1);
    })
    it('should throw graphqlError when email already exists', async()=>{
        const email='existingUser@gmail.com';
        mockFindOne.mockResolvedValue({email});
        await expect(checkExistingEmail(email)).rejects.toThrow(
            new GraphQLError('email already exist',{
                extensions:{
                    code:'USER_ALREADY_EXISTS'
                }
            })
        );
        expect(mockFindOne).toHaveBeenCalledWith({email});
        expect(mockFindOne).toHaveBeenCalledTimes(1);
    })
    it('should throw graphqlError when email is empty', async()=>{
        const email='';
        await expect(checkExistingEmail(email)).rejects.toThrow(
            new GraphQLError('email is required',{
                extensions:{
                    code:'EMAIL_REQUIRED'
                }
            })
        )
    })
    it('should throw error when database fails', async()=>{
        const email='example2gmail.com'
        mockFindOne.mockRejectedValue(new Error('database error'));
        await expect(checkExistingEmail(email)).rejects.toThrow('database error')
        })
})