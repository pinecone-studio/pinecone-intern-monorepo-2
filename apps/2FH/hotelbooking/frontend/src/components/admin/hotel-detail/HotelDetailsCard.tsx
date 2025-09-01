'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/Badge';
import { EditHotelModal } from './EditHotelModal';

interface HotelDetailsCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const HotelDetailsCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: HotelDetailsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{hotel.name} Details</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="details"
          isOpen={editModalState.isOpen && editModalState.section === 'details'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'details' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'details' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* About Section */}
        <div>
          <h4 className="font-bold text-gray-900 mb-2">About</h4>
          <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
        </div>

        {/* What You Need to Know Section */}
        {hotel.optionalExtras?.length > 0 && (
          <div data-testid="optional-extras-section">
            <h4 className="font-bold text-gray-900 mb-2">What You Need to Know</h4>
            <div className="space-y-2">
              {hotel.optionalExtras.map((extra: any, index: number) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium">{extra.youNeedToKnow}</p>
                  <p className="text-sm text-gray-600">{extra.weShouldMention}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {hotel.languages?.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Languages Spoken</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.languages.map((language: string) => (
                <Badge key={language} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
