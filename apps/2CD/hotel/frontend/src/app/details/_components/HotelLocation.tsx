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
    <div className="w-[400px] h-[300px] border rounded-lg overflow-hidden shadow-md">
      <iframe title="Random Location" width="100%" height="100%" src={googleMapsUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
  );
};
