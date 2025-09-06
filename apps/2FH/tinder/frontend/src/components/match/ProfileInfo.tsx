import React from 'react';
import { MatchProfile } from '../../generated';

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

interface ProfileInfoProps {
  profile: MatchProfile;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => (
  <div className="absolute bottom-10 left-6 right-6 text-white">
    <h2 className="text-4xl font-bold mb-1 drop-shadow-lg">
      {profile.name}, <span className="font-light">{calculateAge(profile.dateOfBirth)}</span>
    </h2>
    <p className="text-white/90 text-lg font-medium drop-shadow-md mb-2">{profile.profession}</p>
    <p className="text-white/90 text-base leading-relaxed mb-3 drop-shadow-md">{profile.bio}</p>
    <div className="flex flex-wrap gap-2">
      {profile.interests.slice(0, 3).map((interest, idx) => (
        <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
          {interest}
        </span>
      ))}
    </div>
  </div>
);

