import jwt from 'jsonwebtoken';

import { createToken } from '../../../src/utils/user/create-token-cookie';

jest.mock('jsonwebtoken',()=>({
    sign:jest.fn()
}));


describe('should create the token and set in the cookie',()=>{
    const mockUser={
        email:'cypress@gmail.com',
        _id:'0000'
    };
   
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.TOKEN_SECRET = 'test-secret';
      });
      afterEach(() => {
        delete process.env.TOKEN_SECRET; 
    });
    const mockTokenSecret='test-secret';
    it('should successfully create a token',async()=>{
        const mockToken='secret1234';
        (jwt.sign as jest.Mock).mockResolvedValue(mockToken);
       
        const res=await createToken(mockUser);

        expect(jwt.sign).toHaveBeenCalledWith( { userId: mockUser._id, email: mockUser.email },mockTokenSecret,{expiresIn:'1d'});
       
        expect(res).toEqual(mockToken);
    });

})
