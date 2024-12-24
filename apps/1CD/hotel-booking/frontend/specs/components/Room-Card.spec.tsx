import RoomCard from "@/app/(public)/hotel-detail/RoomCard";
import { render } from "@testing-library/react";

describe('RoomCard', ()=> {
    it('should render successfully', async ()=>{
        render(<RoomCard/>);
    });
});