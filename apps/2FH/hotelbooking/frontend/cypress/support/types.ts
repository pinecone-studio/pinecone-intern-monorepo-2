interface HotelData {
  name: string;
  phone: string;
  city: string;
  country: string;
  location: string;
  stars: number;
  rating: number;
  description: string;
}

// Extend Cypress Chainable interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillBasicHotelInfo(_hotelData?: Partial<HotelData>): Chainable<void>;
      submitHotelForm(): Chainable<void>;
      mockCreateHotelResponse(_success?: boolean, _delay?: number): Chainable<void>;
      mockGraphQL(): Chainable<void>;
    }
  }
}

export type { HotelData };
