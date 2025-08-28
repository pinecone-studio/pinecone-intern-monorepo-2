import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Roomservice } from '../../../src/components/room/Roomservice';

jest.mock('../../../src/components/room/Roomservicemodal', () => ({
  RoomServiceModal: ({ isOpen, onClose, onSave, loading, _data }: any) =>
    isOpen ? (
      <div data-testid="roomservice-modal">
        <button
          onClick={() => onSave({ bathroom: ['Private'], accessibility: ['Wheelchair'], entertainment: ['TV'], foodAndDrink: ['Breakfast'], other: ['Desk'], internet: ['WiFi'], bedRoom: ['AC'] })}
        >
          Save
        </button>
        <button onClick={onClose}>Close</button>
        <span data-testid="modal-loading">{loading ? 'Loading' : 'Not Loading'}</span>
      </div>
    ) : null,
}));

describe('Roomservice Data Formatting & Edge Cases', () => {
  const defaultProps = {
    onSave: jest.fn(),
    loading: false,
    _data: {
      bathroom: ['Private', 'Shared'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV', 'WiFi'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC', 'Heating'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format service data correctly with underscores', () => {
    const dataWithUnderscores = {
      bathroom: ['PRIVATE_BATHROOM', 'SHARED_BATHROOM'],
      accessibility: ['WHEELCHAIR_ACCESS'],
      entertainment: ['TV_ENTERTAINMENT'],
      foodAndDrink: ['FREE_BREAKFAST'],
      other: ['WORK_DESK'],
      internet: ['FREE_WIFI'],
      bedRoom: ['AIR_CONDITIONING'],
    };

    render(<Roomservice {...defaultProps} _data={dataWithUnderscores} />);

    expect(screen.getByText('Private Bathroom, Shared Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Access')).toBeInTheDocument();
    expect(screen.getByText('Tv Entertainment')).toBeInTheDocument();
    expect(screen.getByText('Free Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Work Desk')).toBeInTheDocument();
    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
  });

  it('should handle mixed case data formatting', () => {
    const mixedCaseData = {
      bathroom: ['PRIVATE_BATHROOM', 'shared_bathroom'],
      accessibility: ['WHEELCHAIR_ACCESSIBLE'],
      entertainment: ['TV_SET', 'radio_station'],
      foodAndDrink: ['BREAKFAST_SERVICE'],
      other: ['WORK_DESK'],
      internet: ['WIFI_CONNECTION'],
      bedRoom: ['AIR_CONDITIONING'],
    };

    render(<Roomservice {...defaultProps} _data={mixedCaseData} />);

    expect(screen.getByText('Private Bathroom, Shared Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument();
    expect(screen.getByText('Tv Set, Radio Station')).toBeInTheDocument();
    expect(screen.getByText('Breakfast Service')).toBeInTheDocument();
    expect(screen.getByText('Work Desk')).toBeInTheDocument();
    expect(screen.getByText('Wifi Connection')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
  });

  it('should handle formatServiceData with complex data', () => {
    const complexData = {
      bathroom: ['PRIVATE_BATHROOM_WITH_SHOWER', 'SHARED_BATHROOM_FACILITY'],
      accessibility: ['WHEELCHAIR_ACCESSIBLE_ENTRANCE', 'ELEVATOR_ACCESS'],
      entertainment: ['FLAT_SCREEN_TV', 'CABLE_CHANNELS'],
      foodAndDrink: ['CONTINENTAL_BREAKFAST', 'ROOM_SERVICE_AVAILABLE'],
      other: ['WORK_DESK_WITH_LAMP', 'WARDROBE_STORAGE'],
      internet: ['HIGH_SPEED_WIFI', 'ETHERNET_CONNECTION'],
      bedRoom: ['AIR_CONDITIONING_UNIT', 'CENTRAL_HEATING_SYSTEM'],
    };

    render(<Roomservice {...defaultProps} _data={complexData} />);

    expect(screen.getByText('Private Bathroom With Shower, Shared Bathroom Facility')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Accessible Entrance, Elevator Access')).toBeInTheDocument();
    expect(screen.getByText('Flat Screen Tv, Cable Channels')).toBeInTheDocument();
    expect(screen.getByText('Continental Breakfast, Room Service Available')).toBeInTheDocument();
    expect(screen.getByText('Work Desk With Lamp, Wardrobe Storage')).toBeInTheDocument();
    expect(screen.getByText('High Speed Wifi, Ethernet Connection')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning Unit, Central Heating System')).toBeInTheDocument();
  });

  it('should handle formatServiceData with special characters', () => {
    const specialCharData = {
      bathroom: ['PRIVATE_BATHROOM_&_SHOWER', 'SHARED_BATHROOM_/_FACILITY'],
      accessibility: ['WHEELCHAIR_ACCESS_+_RAMP', 'ELEVATOR_ACCESS_=_AVAILABLE'],
      entertainment: ['TV_WITH_4K_RESOLUTION', 'CABLE_CHANNELS_100+'],
      foodAndDrink: ['BREAKFAST_7AM-10AM', 'ROOM_SERVICE_24/7'],
      other: ['DESK_WITH_USB_PORTS', 'WARDROBE_WITH_HANGERS'],
      internet: ['WIFI_5GHZ_BAND', 'ETHERNET_1GBPS'],
      bedRoom: ['AC_16°C-30°C', 'HEATING_18°C-25°C'],
    };

    render(<Roomservice {...defaultProps} _data={specialCharData} />);

    expect(screen.getByText('Private Bathroom & Shower, Shared Bathroom / Facility')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Access + Ramp, Elevator Access = Available')).toBeInTheDocument();
    expect(screen.getByText('Tv With 4k Resolution, Cable Channels 100+')).toBeInTheDocument();
    expect(screen.getByText('Breakfast 7am-10am, Room Service 24/7')).toBeInTheDocument();
    expect(screen.getByText('Desk With Usb Ports, Wardrobe With Hangers')).toBeInTheDocument();
    expect(screen.getByText('Wifi 5ghz Band, Ethernet 1gbps')).toBeInTheDocument();
    expect(screen.getByText('Ac 16°C-30°C, Heating 18°C-25°C')).toBeInTheDocument();
  });

  it('should handle formatServiceData with numbers and mixed case', () => {
    const mixedData = {
      bathroom: ['BATHROOM_1', 'bathroom_2', 'Bathroom_3'],
      accessibility: ['ACCESS_LEVEL_1', 'access_level_2', 'Access_Level_3'],
      entertainment: ['TV_HD', 'tv_4k', 'Tv_Smart'],
      foodAndDrink: ['BREAKFAST_BASIC', 'breakfast_premium', 'Breakfast_VIP'],
      other: ['DESK_STANDARD', 'desk_executive', 'Desk_Premium'],
      internet: ['WIFI_BASIC', 'wifi_premium', 'Wifi_Ultra'],
      bedRoom: ['AC_BASIC', 'ac_premium', 'Ac_Luxury'],
    };

    render(<Roomservice {...defaultProps} _data={mixedData} />);

    expect(screen.getByText('Bathroom 1, Bathroom 2, Bathroom 3')).toBeInTheDocument();
    expect(screen.getByText('Access Level 1, Access Level 2, Access Level 3')).toBeInTheDocument();
    expect(screen.getByText('Tv Hd, Tv 4k, Tv Smart')).toBeInTheDocument();
    expect(screen.getByText('Breakfast Basic, Breakfast Premium, Breakfast Vip')).toBeInTheDocument();
    expect(screen.getByText('Desk Standard, Desk Executive, Desk Premium')).toBeInTheDocument();
    expect(screen.getByText('Wifi Basic, Wifi Premium, Wifi Ultra')).toBeInTheDocument();
    expect(screen.getByText('Ac Basic, Ac Premium, Ac Luxury')).toBeInTheDocument();
  });
});
