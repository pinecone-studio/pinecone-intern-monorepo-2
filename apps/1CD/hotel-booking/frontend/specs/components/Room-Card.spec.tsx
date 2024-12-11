import RoomCard from "@/components/RoomCard";
import { render } from "@testing-library/react";

describe('RoomCard', ()=> {
    it('should render successfully', async ()=>{
        render(<RoomCard/>);
    });
});