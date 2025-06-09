import { Phone } from 'lucide-react';

interface ContactProps {
  phoneNumber: string | undefined;
}

export const Contact = ({ phoneNumber }: ContactProps) => {
  return (
    <div>
      <h1 className="font-bold mb-4">Contact</h1>

      <div className="flex gap-3">
        <div>
          {' '}
          <Phone size={20} />
        </div>
        <div>
          <p className="text-[#71717A]">phone number</p>
          <p>{phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};
