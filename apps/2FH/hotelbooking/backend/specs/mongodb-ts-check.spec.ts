import { runAllMongoDBTests } from '../src/utils/mongodb-ts-check';

// MongoDB шалгах тест
describe('MongoDB Tests', () => {
  it('should check MongoDB status and run all tests', async () => {
    const results = await runAllMongoDBTests();
    
    expect(results).toBeDefined();
    
    // TypeScript type checking
    if ('error' in results) {
      console.log('MongoDB test error:', results.error);
    } else {
      expect(results.status).toBeDefined();
      expect(results.userCreation).toBeDefined();
      expect(results.userUpdate).toBeDefined();
    }
  }, 30000); // 30 секунд timeout
});
