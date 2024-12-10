import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createTokenandCookie } from '../../../src/utils/user/create-token-cookie';

jest.mock('jsonwebtoken',()=>({
    sign:jest.fn()
}));
jest.mock('next/headers',()=>({
    cookies:jest.fn(()=>({
        set: jest.fn(),
    }))
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
    it('should successfully create a token and set it in the cookie then return the message',async()=>{
        const mockToken='mocktoken';
        (jwt.sign as jest.Mock).mockResolvedValue(mockToken);
        (cookies as jest.Mock).mockReturnValue({
            set: jest.fn()
        });
        const cookieMock = cookies();
       

        const res=await createTokenandCookie(mockUser);

        expect(jwt.sign).toHaveBeenCalledWith( { userId: mockUser._id, email: mockUser.email },mockTokenSecret,{expiresIn:'1d'});
        expect(cookieMock.set).toHaveBeenCalledWith({
            name: 'token',
            value: mockToken,
            httpOnly: true,
            path: '/',
        });
        expect(res).toBe('Token is created and set in the cookie');
    });

})
