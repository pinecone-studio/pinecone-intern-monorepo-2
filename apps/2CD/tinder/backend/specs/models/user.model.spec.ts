import User from 'src/models/user';

describe('User Model', () => {
  it('should fail validation if images has less than 2 items', async () => {
    const user = new User({
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
      age: 22,
      gender: 'Male',
      lookingFor: 'Female',
      images: ['img1'],
    });
    let error: any;
    try {
      await user.validate();
    } catch (err) {
      error = err as { [key: string]: unknown };
    }
    expect(error).toBeDefined();
    expect(error.errors.images).toBeDefined();
    expect(error.errors.images.message).toBe('At least two images are required');
  });
});
