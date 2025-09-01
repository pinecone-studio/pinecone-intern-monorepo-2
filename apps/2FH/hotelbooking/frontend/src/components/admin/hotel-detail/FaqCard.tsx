'use client';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { EditHotelModal } from './EditHotelModal';

interface FAQCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const FAQCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: FAQCardProps) => {
  if (!hotel.faq || hotel.faq.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Frequently Asked Questions</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="faq"
          isOpen={editModalState.isOpen && editModalState.section === 'faq'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'faq' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'faq' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotel.faq.map((faq: any, index: number) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
