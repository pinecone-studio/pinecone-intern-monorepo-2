
import { generateOTP } from "../../../src/utils/user/generate-otp";

describe('generate otp', ()=>{
    it('it should generate the otp',()=>{
        const res=generateOTP();
        expect(res).toBeGreaterThan(1000)
        expect(res).toBeLessThan(9999);
        expect(typeof res).toBe('number');
    })  
})