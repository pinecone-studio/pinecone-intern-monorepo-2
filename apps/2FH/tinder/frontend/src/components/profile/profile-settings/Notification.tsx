interface NotificationProps {
  message: string;
  onClose: () => void;
}

export const Notification = ({ message, onClose }: NotificationProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-6xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-green-800">Profile Updated Successfully</h3>
            <p className="text-sm text-green-700 mt-1">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
