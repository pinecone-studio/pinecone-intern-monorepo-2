import HotelPolicies from "@/components/HotelPolicies";
import { render } from "@testing-library/react"

describe('HotelPolicies', () =>{
    it('HotelPolicies should successfully', async()=>{
        render(<HotelPolicies/>);
    });
});