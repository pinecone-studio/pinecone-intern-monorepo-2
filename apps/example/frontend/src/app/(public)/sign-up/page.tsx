'use client';

import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Page = () => {
  const router = useRouter();

  const handleSubmit = (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    localStorage.setItem(
      'userData',
      JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      })
    );

    router.push('/login');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      data-cy="Sign-Up-Page"
    >
      <div style={{ width: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <Formik initialValues={{ username: '', email: '', password: '', confirmPassword: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, errors }) => (
            <Form>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="username">Username</label>
                <Field data-cy="Sign-Up-Username-Input" name="username" type="text" style={{ width: '100%', border: '1px solid #ccc', padding: '8px', margin: '5px 0' }} />
                {errors.username && (
                  <div className="error" data-cy="Sign-Up-Username-Input-Error-Message">
                    {errors.username}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="email">Email</label>
                <Field data-cy="Sign-Up-Email-Input" name="email" type="email" style={{ width: '100%', border: '1px solid #ccc', padding: '8px', margin: '5px 0' }} />
                {errors.email && (
                  <div data-cy="Sign-Up-Email-Input-Error-Message" className="error">
                    {errors.email}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="password">Password</label>
                <Field name="password" data-cy="Sign-Up-Password-Input" type="password" style={{ width: '100%', border: '1px solid #ccc', padding: '8px', margin: '5px 0' }} />
                {errors.password && (
                  <div data-cy="Sign-Up-Password-Input-Error-Message" className="error">
                    {errors.password}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field name="confirmPassword" data-cy="Sign-Up-Confirm-Password-Input" type="password" style={{ width: '100%', border: '1px solid #ccc', padding: '8px', margin: '5px 0' }} />
                {errors.confirmPassword && (
                  <div data-cy="Sign-Up-Confirm-Password-Input-Error-Message" className="error">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button data-cy="Sign-Up-Submit-Button" type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', cursor: 'pointer', border: '1px solid #ccc' }}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
