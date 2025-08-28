'use client';
import { Button } from '@/components/ui/button';
import { useSendOtpMutation } from '@/generated';
import { toast } from 'sonner';
import { LoadingSvg } from '../assets/LoadingSvg';
import { useOtpContext } from '@/components/providers';

export const ReSendOtp = () => {
  const { email, resetOtp } = useOtpContext();

  const [SendOtp, { loading }] = useSendOtpMutation();

  const handleReSendOtp = async () => {
    try {
      await SendOtp({ variables: { email } });
      resetOtp();
      toast.success("We've resent the OTP.");
    } catch {
      toast.error('Failed to resend OTP.');
    }
  };

  return (
    <Button data-cy="Reset-Time-Interval-Button" data-testid="button" variant="outline" onClick={handleReSendOtp} disabled={loading}>
      {loading ? <LoadingSvg /> : 'Send again'}
    </Button>
  );
};
