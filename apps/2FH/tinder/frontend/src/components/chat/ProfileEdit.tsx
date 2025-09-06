'use client';

import React, { useEffect, useMemo, useState } from 'react';
import TagSelector from '../profile/steps/TagSelector';
import { validateField } from '@/utils/profile-validation';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

type GenderPreference = 'Male' | 'Female' | 'Both';

type ProfileEditValues = {
  name: string;
  email: string;
  dateOfBirth: string;
  gender: GenderPreference | '';
  bio: string;
  interests: string[];
  profession: string;
  work: string;
};

const defaultValues: ProfileEditValues = {
  name: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  bio: '',
  interests: [],
  profession: '',
  work: '',
};

const fieldClass = (hasError: boolean) => `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${hasError ? 'border-red-500' : 'border-gray-300'}`;

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <section className="space-y-3">
    <div>
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {description ? <p className="text-sm text-gray-500">{description}</p> : null}
    </div>
    {children}
  </section>
);

export const ProfileEdit: React.FC<{ initial?: Partial<ProfileEditValues>; onSubmit?: (_values: ProfileEditValues) => void; userId?: string }> = ({ initial, onSubmit, userId }) => {
  const [values, setValues] = useState<ProfileEditValues>({ ...defaultValues, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const GET_USER = gql`
    query GetUserForEdit($id: ID!) {
      user(id: $id) {
        id
        email
      }
    }
  `;
  const GET_PROFILE = gql`
    query GetProfileForEdit($userId: ID!) {
      getProfile(userId: $userId) {
        name
        bio
        interests
        profession
        work
        dateOfBirth
        interestedIn
      }
    }
  `;

  const UPDATE_PROFILE = gql`
    mutation UpdateProfileFromEdit($input: UpdateProfileInput!) {
      updateProfile(input: $input)
    }
  `;

  const { data } = useQuery(GET_PROFILE, { variables: { userId: userId as string }, skip: !userId });
  const { data: userData } = useQuery(GET_USER, { variables: { id: userId as string }, skip: !userId });
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (!data?.getProfile && !userData?.user?.email) return;
    const p = data.getProfile;
    setValues((prev) => ({
      ...prev,
      name: p.name || '',
      email: userData?.user?.email || '',
      dateOfBirth: p.dateOfBirth?.slice(0, 10) || '',
      gender: ((p.interestedIn || 'both').toString().charAt(0).toUpperCase() + (p.interestedIn || 'both').toString().slice(1)) as any,
      bio: p.bio || '',
      interests: Array.isArray(p.interests) ? p.interests : [],
      profession: p.profession || '',
      work: p.work || '',
    }));
    console.log(userData?.user?.email, 'userData?.user?.email');
  }, [data?.getProfile, userData?.user?.email]);

  const canSubmit = useMemo(() => {
    const requiredFilled = Boolean(values.name && values.dateOfBirth && values.gender && values.profession && values.work);
    return requiredFilled && Object.keys(errors).length === 0;
  }, [values, errors]);

  const setField = <K extends keyof ProfileEditValues>(key: K, value: ProfileEditValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    // Map UI fields to validation schema fields where applicable
    const validatableKeys: Partial<Record<keyof ProfileEditValues, keyof ProfileEditValues | 'interests'>> = {
      name: 'name',
      bio: 'bio',
      profession: 'profession',
      work: 'work',
      dateOfBirth: 'dateOfBirth',
    };

    const schemaKey = validatableKeys[key];
    if (schemaKey) {
      const raw = key === 'interests' && Array.isArray(value) ? (value as string[]).join(',') : (value as unknown as string);
      const result = validateField(schemaKey as any, raw);
      setErrors((prev) => {
        const next = { ...prev } as Record<string, string>;
        if (result.success) {
          delete next[key as string];
        } else if (result.error) {
          next[key as string] = result.error;
        }
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (onSubmit) {
      onSubmit(values);
      return;
    }
    if (!userId) return;
    try {
      const payload: any = {
        userId,
        name: values.name,
        bio: values.bio,
        interests: values.interests,
        profession: values.profession,
        work: values.work,
        dateOfBirth: values.dateOfBirth,
        interestedIn: (values.gender || 'Both').toLowerCase(),
      };
      const res = await updateProfile({ variables: { input: payload } });
      if (res.data?.updateProfile === 'SUCCESS') {
        toast.success('Profile updated');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Error updating profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[425px]  rounded-lg p-4">
      <Section title="Personal Information" description="This is how others will see you on the site.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input value={values.name} onChange={(e) => setField('name', e.target.value)} className={fieldClass(Boolean(errors.name))} placeholder="Your name" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} className={fieldClass(false)} placeholder="Your email" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
            <input type="date" value={values.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} className={fieldClass(Boolean(errors.dateOfBirth))} />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            <p className="text-sm text-gray-500 mt-1">Your date of birth is used to calculate your age.</p>
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preferences:</label>
          <div className="relative">
            <select value={values.gender} onChange={(e) => setField('gender', e.target.value as GenderPreference)} className={fieldClass(false)}>
              <option value="" disabled>
                Select preference
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Bio">
        <textarea rows={3} value={values.bio} onChange={(e) => setField('bio', e.target.value)} className={fieldClass(Boolean(errors.bio))} placeholder="Tell us about yourself" />
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </Section>

      <Section title="Interest">
        <TagSelector onChange={(tags) => setField('interests', tags)} initialSelected={values.interests} />
        <p className="text-sm text-gray-500 mt-2">You can select up to a maximum of 10 interests.</p>
      </Section>

      <Section title="Profession">
        <input value={values.profession} onChange={(e) => setField('profession', e.target.value)} className={fieldClass(Boolean(errors.profession))} placeholder="Your profession" />
        {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
      </Section>

      <Section title="School/Work">
        <input value={values.work} onChange={(e) => setField('work', e.target.value)} className={fieldClass(Boolean(errors.work))} placeholder="Your school/work" />
        {errors.work && <p className="text-red-500 text-sm mt-1">{errors.work}</p>}
      </Section>

      <div className="pt-2">
        <button type="submit" disabled={!canSubmit} className={`px-4 py-2 rounded-md text-white font-semibold ${canSubmit ? 'bg-[#E11D48E5] hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`}>
          Update profile
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;
