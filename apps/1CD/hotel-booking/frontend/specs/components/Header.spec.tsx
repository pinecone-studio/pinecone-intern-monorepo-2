import Header from "@/components/Header"
import { render } from "@testing-library/react";

describe('Header', ()=> {
    it('should render successfully', async ()=>{
        render(<Header/>);
    });
});