describe('Mutation Index', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  afterAll(() => {
    jest.spyOn(console, 'log').mockRestore();
  });

  it('should pass example test', () => {
    console.log('example-test'); // Mock-логдсон тул гаралтад харагдахгүй
    expect(true).toBe(true);
  });
});
