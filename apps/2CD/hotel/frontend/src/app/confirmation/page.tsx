import React from 'react';
import Header from '../../components/header/Header';
import FooterCheckIn from '../../components/footer/footer-check-in';

const ConfirmationPage = () => {
  return (
    <>
      <Header />
      <div className="w-full flex justify-center">
        <div className="w-[1280px] flex flex-col items-center py-12 gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold text-green-600">You&apos;re confirmed!</h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-600">Contact email</p>
              <p className="font-medium">samlee.mobbin@gmail.com</p>
            </div>
            <p className="text-blue-600 font-medium">View your booking</p>
          </div>

          <div className="w-[600px] border rounded-lg shadow-sm p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Flower Hotel Ulaanbaatar</h2>
                <p className="text-gray-600">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">8.6</span>
                  <span className="font-medium">Excellent</span>
                </div>
              </div>

              <div className="border-t border-b py-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Check in</p>
                  <p>Monday, Jul 1, 3:00pm</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Check out</p>
                  <p>Tuesday, Jul 3, 11:00am</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Standard Single Room, 1 King Bed</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>1 Queen Bed</li>
                  <li>Breakfast included</li>
                  <li>Sleeps 2</li>
                  <li>Pet friendly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterCheckIn />
    </>
  );
};

export default ConfirmationPage; 