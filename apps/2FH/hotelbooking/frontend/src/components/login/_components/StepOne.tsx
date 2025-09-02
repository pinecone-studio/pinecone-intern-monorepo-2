'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLoginMutation } from '@/generated';

export const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });

      if (!data?.login?.token) throw new Error('Login failed: no token returned');

      localStorage.setItem('token', data.login.token);

      toast.success(<span data-cy="login-success-toast">Login Successful! Welcome back, {data.login.user.email}!</span>);

      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      toast.error(<span data-cy="login-failed-toast">{err.message}</span>);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50" data-cy="login-container" data-testid="login-container">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <img src="./images/PediaLogo.png" alt="Logo" className="mx-auto mb-4" data-cy="login-logo" />
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <p className="text-gray-500 mt-1 text-sm">Enter your email and password to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input data-testid="email-input" id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} data-cy="login-email" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  data-testid="password-input"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-cy="login-password"
                />
                <button
                  type="button"
                  data-testid="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  data-cy="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button onClick={handleLogin} disabled={loading} className="w-full" data-cy="login-submit" data-testid="submit-button">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
