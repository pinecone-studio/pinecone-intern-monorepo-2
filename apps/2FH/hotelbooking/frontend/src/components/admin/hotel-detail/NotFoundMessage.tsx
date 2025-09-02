'use client';

export const NotFoundMessage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-600">The hotel you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    </div>
  );
};
