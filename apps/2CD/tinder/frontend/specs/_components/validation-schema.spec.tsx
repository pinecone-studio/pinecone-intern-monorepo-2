import { validationSchema, FormValues } from '@/app/profile/_components/form/validation-schema';

const baseValidData: FormValues = {
  name: 'John Doe',
  email: 'john@example.com',
  birthDate: new Date('1990-01-01'),
  gender: 'Male',
  bio: 'Hello there',
  profession: 'Developer',
  school: 'Some University',
  selectedInterests: ['Art', 'Music'],
};

describe('validationSchema', () => {
  it('validates correct data', async () => {
    await expect(validationSchema.validate(baseValidData)).resolves.toEqual(baseValidData);
  });

  const invalidCases = [
    {
      name: 'missing name',
      data: { ...baseValidData, name: undefined },
      error: 'Name is required',
    },
    {
      name: 'invalid email',
      data: { ...baseValidData, email: 'invalid-email' },
      error: 'Invalid email',
    },
    {
      name: 'empty string birth date',
      data: { ...baseValidData, birthDate: '' as any },
      error: 'Birth date is required',
    },
    {
      name: 'adult user',
      data: {
        ...baseValidData,
        birthDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 20),
      },
      error: undefined,
    },
    {
      name: 'invalid gender',
      data: { ...baseValidData, gender: 'Alien' as any },
      error: 'gender must be one of the following values: Male, Female, Other',
    },
    {
      name: 'too many interests',
      data: { ...baseValidData, selectedInterests: Array(11).fill('Art') },
      error: 'Select up to 10 interests',
    },
  ];

  test.each(invalidCases)('$name', async ({ data, error }) => {
    await expect(validationSchema.validate(data)).rejects.toThrow(error);
  });
});
