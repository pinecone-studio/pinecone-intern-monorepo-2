import { render,  act } from '@testing-library/react';
import CarouselMain from '../../../src/components/carousel'; 
import { useGetSpecialEventQuery } from "../../../src/generated";


jest.mock('../../../src/generated', () => ({
  useGetSpecialEventQuery: jest.fn(),
}));

const mockData = {
  
          _id: "1",
          name: "World Tour",
          scheduledDays: "2025.09.08",
          mainArtists: [{ name: "OneDirection" }],
          image: "https://example.com/images/rockit-bay-concert.jpg",
          priority: "high",
        
}
    
describe('CarouselMain', () => {
    beforeEach(() => {
       (useGetSpecialEventQuery as jest.Mock).mockResolvedValueOnce({
        data: [mockData],
        error: null,
        isLoading: false,
      });
      });

  it('should render the carousel and show events', async () => {
    render(<CarouselMain />);
  });

  it('should navigate to the next event', async () => {
    const setApiMock = jest.fn();
    

    const apiMock = {
        selectedScrollSnap: jest.fn().mockReturnValue(0),
        on: jest.fn(),
        off: jest.fn(),
        scrollTo: jest.fn(),
      };
      setApiMock(apiMock);

      render(<CarouselMain />);
      act(() => {
        apiMock.scrollTo(1); 
      });
      expect(apiMock.scrollTo);
 });

 it('should navigate to the previous event', async () => {
  const setApiMock = jest.fn();
  

  const apiMock = {
      selectedScrollSnap: jest.fn().mockReturnValue(2),
      on: jest.fn(),
      off: jest.fn(),
      scrollTo: jest.fn(),
    };
    setApiMock(apiMock);

    render(<CarouselMain />);
    act(() => {
      apiMock.scrollTo(1); 
    });
    expect(apiMock.scrollTo);
});


  it('should automatically scroll to the next event after a delay', async () => {
    jest.useFakeTimers();  
    render(<CarouselMain />);
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    jest.useRealTimers();
  });


});
