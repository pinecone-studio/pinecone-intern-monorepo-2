'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreatesOtpMutation } from '@/generated';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { useLogin } from '@/context/LoginContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { setEmail, setExpirationDate } = useLogin();
  const router = useRouter();
  const [createOtp, { error, loading }] = useCreatesOtpMutation();
  const [oldEmail, setOldEmail] = useState<string>();
  const sendEmail = async (values: { email: string }) => {
    setOldEmail(values.email);
    try {
      const response = await createOtp({ variables: { email: values.email.toLowerCase() } });
      if (response.data) {
        setEmail(response.data.createsOTP!.email.toLowerCase());
        setExpirationDate(response.data.createsOTP!.expirationDate);
        router.push('/sendOtp');
      }
    } catch (err) {
      console.error('Error creating OTP:', err);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('И-мэйл хаяг буруу байна') 
      .required('И-мэйл хаяг оруулна уу') 
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'И-мэйл хаяг буруу байна' 
      )
      .min(5, 'И-мэйл хаяг хамгийн багадаа 5 тэмдэгт байх ёстой')
      .max(50, 'И-мэйл хаяг хамгийн ихдээ 50 тэмдэгт байх ёстой'),
  });

  return (
    <div className="mt-24" data-testid="createOTP-modal">
      <Card className="bg-white w-[500px] h-full m-auto mx-auto p-12">
        <h1 className="font-bold text-center mb-6 mx-4">Нэвтрэх</h1>
        <Image src={'/logo.png'} alt="logo" width={150} height={150} className="mx-auto" />
        <Formik initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={sendEmail}>
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <div className="mt-8 mx-4 flex flex-col gap-2">
                <Label className="mt-4">И-мэйл хаяг</Label>
                <Input id="email" placeholder="Email" className="mt-2" name="email" onChange={handleChange} value={values.email} data-testid="email-input" />
                {touched.email && errors.email && <span className="text-red-500">{errors.email}</span>}
                {error && values.email == oldEmail && <span className="text-red-500">{error.message}</span>}
              </div>
              <Button type="submit" className="mt-6 mx-4 w-[375px] mb-6" disabled={loading} data-testid="sendOTP-submit-button">
                Нэвтрэх
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login;
