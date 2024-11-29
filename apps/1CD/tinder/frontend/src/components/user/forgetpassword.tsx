'use client';

import { useState } from 'react';

const Forgetpassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log('Password successfully set!');
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 justify-center">
        <img src="./image/tinderlogo.png" alt="Tinder" className="w-32 mb-8" />
        {step === 1 && (
          <>
            <h1 className="text-center text-2xl font-semibold mb-2">Forget Passwordddddd</h1>
            <p className="text-center text-gray-500 text-sm mb-6">Enter your email account to reset your password</p>

            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#fd5b6d] hover:bg-[#fd4b5d] text-white py-3 rounded-full font-medium transition duration-200">
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="text-center">
            <img src="./image/tinderlogo.png" alt="Tinder" className="w-32 mb-8" />
            <h1 className="text-2xl font-semibold mb-2">Confirm Email</h1>
            <p className="text-gray-500 text-sm mb-8">
              To continue, enter the secure code we sent to
              <br />
              <span className="text-black">{email}</span>. Check junk mail if it's not in
              <br />
              your inbox.
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:border-pink-500"
                />
              ))}
            </div>

            <button onClick={() => setStep(3)} className="text-[#fd5b6d] hover:text-[#fd4b5d] font-medium">
              Send again (15)
            </button>
          </div>
        )}

        {step === 3 && (
          <>
            <img src="./image/tinderlogo.png" alt="Tinder" className="w-32 mb-8" />
            <h1 className="text-center text-2xl font-semibold mb-2">Set New Password</h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Use a minimum of 8 characters including
              <br />
              uppercase letters, lowercase letters, and numbers
            </p>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#fd5b6d] hover:bg-[#fd4b5d] text-white py-3 rounded-full font-medium transition duration-200">
                Continue
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-auto py-6 text-gray-400 text-sm">©2024 Tinder</div>
    </div>
  );
};

export default Forgetpassword;
