import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Shield } from 'lucide-react';
import type { Policy } from './types';

export const PoliciesSection = ({ policies, onPoliciesChange, ...props }: { policies: Policy[]; onPoliciesChange: (_policies: Policy[]) => void }) => {
  const addPolicy = () => {
    onPoliciesChange([
      ...policies,
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: '',
        accessMethods: ['Key card'],
        childrenAndExtraBeds: '',
        pets: '',
      },
    ]);
  };

  const removePolicy = (index: number) => {
    onPoliciesChange(policies.filter((_, i) => i !== index));
  };

  const updatePolicy = (index: number, field: keyof Policy, value: string | string[]) => {
    const newPolicies = [...policies];
    newPolicies[index] = { ...newPolicies[index], [field]: value };
    onPoliciesChange(newPolicies);
  };

  const addAccessMethod = (policyIndex: number) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].accessMethods.push('');
    onPoliciesChange(newPolicies);
  };

  const removeAccessMethod = (policyIndex: number, methodIndex: number) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].accessMethods.splice(methodIndex, 1);
    onPoliciesChange(newPolicies);
  };

  const updateAccessMethod = (policyIndex: number, methodIndex: number, value: string) => {
    const newPolicies = [...policies];
    newPolicies[policyIndex].accessMethods[methodIndex] = value;
    onPoliciesChange(newPolicies);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} className="text-orange-500" />
          Policies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {policies.map((policy, policyIndex) => (
          <div key={policyIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Policy {policyIndex + 1}</h4>
              {policies.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removePolicy(policyIndex)} data-testid="button">
                  <X size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`checkin-${policyIndex}`}>Check-in Time</Label>
                <Input id={`checkin-${policyIndex}`} type="time" value={policy.checkIn} onChange={(e) => updatePolicy(policyIndex, 'checkIn', e.target.value)} />
              </div>

              <div>
                <Label htmlFor={`checkout-${policyIndex}`}>Check-out Time</Label>
                <Input id={`checkout-${policyIndex}`} type="time" value={policy.checkOut} onChange={(e) => updatePolicy(policyIndex, 'checkOut', e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor={`instructions-${policyIndex}`}>Special Check-in Instructions</Label>
              <Textarea
                id={`instructions-${policyIndex}`}
                value={policy.specialCheckInInstructions}
                onChange={(e) => updatePolicy(policyIndex, 'specialCheckInInstructions', e.target.value)}
                placeholder="Enter special check-in instructions..."
              />
            </div>

            <div>
              <Label>Access Methods</Label>
              <div className="space-y-2">
                {policy.accessMethods.map((method, methodIndex) => (
                  <div key={methodIndex} className="flex gap-2">
                    <Input value={method} onChange={(e) => updateAccessMethod(policyIndex, methodIndex, e.target.value)} placeholder="Enter access method..." />
                    {policy.accessMethods.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeAccessMethod(policyIndex, methodIndex)} data-testid="button">
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addAccessMethod(policyIndex)} className="flex items-center gap-2" data-testid="button">
                  <Plus size={16} />
                  Add Access Method
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor={`children-${policyIndex}`}>Children and Extra Beds Policy</Label>
              <Textarea
                id={`children-${policyIndex}`}
                value={policy.childrenAndExtraBeds}
                onChange={(e) => updatePolicy(policyIndex, 'childrenAndExtraBeds', e.target.value)}
                placeholder="Enter children and extra beds policy..."
              />
            </div>

            <div>
              <Label htmlFor={`pets-${policyIndex}`}>Pet Policy</Label>
              <Textarea id={`pets-${policyIndex}`} value={policy.pets} onChange={(e) => updatePolicy(policyIndex, 'pets', e.target.value)} placeholder="Enter pet policy..." />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addPolicy} className="flex items-center gap-2" data-testid="button">
          <Plus size={16} />
          Add Policy
        </Button>
      </CardContent>
    </Card>
  );
};
