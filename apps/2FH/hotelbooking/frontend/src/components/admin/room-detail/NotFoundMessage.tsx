/* eslint-disable  */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export const NotFoundMessage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Search className="h-5 w-5" />
              Room Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">The room you're looking for could not be found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
