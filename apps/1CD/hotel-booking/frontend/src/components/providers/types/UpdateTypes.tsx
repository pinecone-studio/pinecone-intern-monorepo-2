import { EmergencyStatusEnum } from '@/generated';

export type UpdateContextType = {
  updateProfileData: (_params: UpdateParams) => Promise<void>;
};

export type UpdateParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  emergencyContact: string;
  emergencyStatus: EmergencyStatusEnum | null;
};
