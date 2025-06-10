'use client';

import { useEffect, useState } from 'react';

export const Location = () => {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const randomLat = '37.774929';
    const randomLng = '-122.419418';
    setCoords({ lat: parseFloat(randomLat), lng: parseFloat(randomLng) });
  }, []);

  const googleMapsUrl = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=10&output=embed`;

  return (
    <div className="p-4 w-[400px] h-fit border rounded-lg overflow-hidden ">
      <p className="text-[12px]">Damdinbazar street-52, Bayangol district, Bayangol, 212513 Ulaanbaatar, Mongolia</p>
      <a href={googleMapsUrl} className="text-blue-600">
        View in Google Maps
      </a>
    </div>
  );
};
