'use client';

import { useUser } from '@clerk/nextjs';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { profileValidationSchema } from '@/schemaValidation/profile';
import { ProfileForm } from './_features/ProfileForm';
import { useCreateProfileMutation } from '@/generated';
import { ProfileFormValues } from '@/type/profile-form';

const CreateProfile = () => {
    const { user, isLoaded } = useUser();
    const [createProfile] = useCreateProfileMutation();

    const handleSubmitNewSubmit = async (values: ProfileFormValues) => {
        if (!isLoaded || !user) return;
        try {
            await createProfile({
                variables: {
                    input: {
                        userId: values.userId,
                        bio: values.bio,
                        age: values.age,
                        gender: values.gender,
                        lookingFor: values.lookingFor,
                        interests: values.interests,
                        profession: values.profession,
                        education: values.education,
                        isCertified: values.isCertified,
                        images: values.images,
                        firstName: values.firstName
                    },
                },
            });
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    }

    const formik = useFormik<ProfileFormValues>({
        initialValues: {
            userId: '',
            firstName: '',
            age: 18,
            bio: '',
            profession: '',
            education: '',
            gender: '',
            lookingFor: '',
            interests: [],
            isCertified: false,
            images: ['image1.jpg', 'image2.jpg'],
        },
        validationSchema: profileValidationSchema,
        onSubmit: handleSubmitNewSubmit,
    });

    useEffect(() => {
        if (isLoaded && user?.id) {
            formik.setFieldValue('firstName', user.firstName || '');
            formik.setFieldValue('userId', user.id);
        }
    }, [isLoaded, user]);

    return (
        <div className="bg-zinc-900 text-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Create account</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-8">
                <ProfileForm formik={formik} />

                <div className="col-span-2 flex justify-center mt-6">
                    <button
                        type="submit"
                        className="w-full max-w-sm bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProfile;
