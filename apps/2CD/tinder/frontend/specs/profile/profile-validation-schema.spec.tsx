import { profileValidationSchema } from "@/schemaValidation/profile";


describe('profileValidationSchema', () => {
  const validProfile = {
    userId: 'abc123',
    firstName: 'John',
    age: 25,
    bio: 'Hello there!',
    profession: 'Engineer',
    education: 'MIT',
    gender: 'Male',
    lookingFor: 'Female',
    interests: ['Hiking', 'Reading'],
    isCertified: true,
    images: ['https://example.com/image.jpg']
  };

  it('should validate a correct profile', async () => {
    await expect(profileValidationSchema.validate(validProfile)).resolves.toBeTruthy();
  });

  it('should fail when required fields are missing', async () => {
    const invalidProfile = {};

    await expect(profileValidationSchema.validate(invalidProfile)).rejects.toThrow(
      /User ID is required/
    );
  });

  it('should fail when age is under 18', async () => {
    const profile = { ...validProfile, age: 17 };

    await expect(profileValidationSchema.validate(profile)).rejects.toThrow(
      /You must be at least 18/
    );
  });

  it('should fail with invalid gender', async () => {
    const profile = { ...validProfile, gender: 'Alien' };

    await expect(profileValidationSchema.validate(profile)).rejects.toThrow(
      /Gender must be one of the following values/
    );
  });

  it('should fail with no interests', async () => {
    const profile = { ...validProfile, interests: [] };

    await expect(profileValidationSchema.validate(profile)).rejects.toThrow(
      /Select at least one interest/
    );
  });

  it('should fail with no images', async () => {
    const profile = { ...validProfile, images: [] };

    await expect(profileValidationSchema.validate(profile)).rejects.toThrow(
      /At least one image is required/
    );
  });

  it('should fail with invalid image URL', async () => {
    const profile = { ...validProfile, images: ['not-a-url'] };

    await expect(profileValidationSchema.validate(profile)).rejects.toThrow(
      /images\[0\] must be a valid URL/
    );
  });
});
