import HeaderCheckout from "@/components/HeaderCheckout"
import { render } from "@testing-library/react"

describe('Header-Checkout', () =>{
    it('Header-Checkout should successfully', async()=>{
        render(<HeaderCheckout/>);
    });
});