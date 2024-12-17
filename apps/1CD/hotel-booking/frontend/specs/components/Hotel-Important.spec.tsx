import HotelImportant from "@/components/HotelImportant";
import { render } from "@testing-library/react"

describe('HotelImportant', () => {
    it('HotelImportant should successfully', async () => {
        render(<HotelImportant />);
    });
});