import { userModel } from "../../../../src/models";
import { signIn } from "../../../../src/resolvers/mutations";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import bcrypt from 'bcrypt';
import { createToken } from "../../../../src/utils/user/create-token-cookie";

jest.mock('../../../../src/models',()=>({
    userModel:{
        findOne:jest.fn()
    }
}));
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
  }));
  
  jest.mock("../../../../src/utils/user/create-token-cookie", () => ({
    createToken: jest.fn(),
  }));

describe('sign in the user',()=>{
    const mockPassword="Tinder1234@";
    const mockWrongEmail='wrongEmail@gmail.com'
    const userId=null;
    const mockToken='Test1234'
    const info={} as GraphQLResolveInfo;
    const user={
        email:"test@gmail.com",
        password:"Tinder1213@"
    };

    const cypressUser={
        email:"cypress@gmail.com",
        password:"Tinder1213@"
    }

    beforeEach(() => {
        jest.clearAllMocks();
      });
    
    it('should throw error when user is not registered',async()=>{
       (userModel.findOne as jest.Mock).mockResolvedValue(null);
        await expect(signIn!({},{email:mockWrongEmail,password:mockPassword},{userId},info)).rejects.toThrow(GraphQLError);
        await expect(signIn!({},{email:mockWrongEmail,password:mockPassword},{userId},info)).rejects.toThrow('Looks like you’re not signed up yet. No worries—sign up now and join the fun!');
    });
    it('should return token when user signed in successfully',async()=>{
        (userModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (createToken as jest.Mock).mockResolvedValue(mockToken);
        const res=await signIn!({},{email:user.email, password:user.password},{userId},info);
        expect(res).toEqual({
            token:mockToken
        });
    });
    it('should return token when user is cypress signed in successfully',async()=>{
        (userModel.findOne as jest.Mock).mockResolvedValue(cypressUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (createToken as jest.Mock).mockResolvedValue(mockToken);
        const res=await signIn!({},{email:cypressUser.email, password:cypressUser.password},{userId},info);
        expect(res).toEqual({
            token:mockToken
        });
    });
    
    it('should throw error when password is incorrect', async()=>{
        (userModel.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false); 
        await expect(signIn!({},{email:"test@gmail.com",password:mockPassword},{userId},info)).rejects.toThrow(GraphQLError);
        await expect(signIn!({},{email:"test@gmail.com",password:mockPassword},{userId},info)).rejects.toThrow('Your password is incorrect. Don’t worry—try again.');
    })
})