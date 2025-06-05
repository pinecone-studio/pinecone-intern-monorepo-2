/* eslint-disable unicorn/filename-case */
import { Wifi, Dumbbell, Flower, ParkingCircle, Utensils, Car, Waves } from 'lucide-react';

type AmenitiesProps = {
  amenities: string[];
};

const AMENITY_ICONS: Record<string, { label: string; Icon: React.ElementType }> = {
  'Free WiFi': { label: 'Free WiFi', Icon: Wifi },
  Spa: { label: 'Spa access', Icon: Flower },
  Gym: { label: 'Fitness center access', Icon: Dumbbell },
  Parking: { label: 'Free self parking', Icon: ParkingCircle },
  Breakfast: { label: 'Complimentary breakfast', Icon: Utensils },
  Airport: { label: 'Airport shuttle service', Icon: Car },
  Pool: { label: 'Pool', Icon: Waves },
};

const Amenities = ({ amenities }: AmenitiesProps) => {
  return (
    <>
      {Object.entries(AMENITY_ICONS).map(([key, { label, Icon }]) =>
        amenities.includes(key) ? (
          <p key={key} className="flex items-center gap-2">
            <Icon size={16} />
            {label}
          </p>
        ) : null
      )}
    </>
  );
};

export default Amenities;
