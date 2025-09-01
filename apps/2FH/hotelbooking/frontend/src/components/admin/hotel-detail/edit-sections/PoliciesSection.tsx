'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PoliciesSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const PoliciesSection = ({ formData, handleInputChange }: PoliciesSectionProps) => {
  return (
    <div className="space-y-4">
      {formData.policies.map((policy: any, index: number) => (
        <div key={index} className="border p-4 rounded-lg">
          <h4 className="font-medium mb-3">Policy {index + 1}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in Time</Label>
              <Input
                value={policy.checkIn}
                onChange={(e) => {
                  const newPolicies = [...formData.policies];
                  newPolicies[index] = { ...policy, checkIn: e.target.value };
                  handleInputChange('policies', newPolicies);
                }}
              />
            </div>
            <div>
              <Label>Check-out Time</Label>
              <Input
                value={policy.checkOut}
                onChange={(e) => {
                  const newPolicies = [...formData.policies];
                  newPolicies[index] = { ...policy, checkOut: e.target.value };
                  handleInputChange('policies', newPolicies);
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Special Check-in Instructions</Label>
            <Textarea
              value={policy.specialCheckInInstructions}
              onChange={(e) => {
                const newPolicies = [...formData.policies];
                newPolicies[index] = { ...policy, specialCheckInInstructions: e.target.value };
                handleInputChange('policies', newPolicies);
              }}
              rows={2}
            />
          </div>
          <div className="mt-4">
            <Label>Children and Extra Beds</Label>
            <Input
              value={policy.childrenAndExtraBeds}
              onChange={(e) => {
                const newPolicies = [...formData.policies];
                newPolicies[index] = { ...policy, childrenAndExtraBeds: e.target.value };
                handleInputChange('policies', newPolicies);
              }}
            />
          </div>
          <div className="mt-4">
            <Label>Pet Policy</Label>
            <Input
              value={policy.pets}
              onChange={(e) => {
                const newPolicies = [...formData.policies];
                newPolicies[index] = { ...policy, pets: e.target.value };
                handleInputChange('policies', newPolicies);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
