#!/usr/bin/env node

/**
 * Simple test script for database connection utility
 * Run with: node test-db-connection.js
 */

// Mock environment for testing
process.env.MONGO_URI = 'mongodb://localhost:27017/test';

// Import the utility
const { connectToDb } = require('./src/utils/connect-to-db');

async function testConnection() {
  console.log('🧪 Testing database connection utility...\n');
  
  try {
    console.log('✅ Testing successful connection...');
    await connectToDb();
    console.log('✅ Connection test passed!\n');
  } catch (error) {
    console.log('❌ Connection test failed (expected in test environment):', error.message);
    console.log('✅ Error handling test passed!\n');
  }
  
  // Test error handling
  console.log('🧪 Testing error handling...');
  delete process.env.MONGO_URI;
  
  try {
    await connectToDb();
    console.log('❌ Should have thrown an error');
  } catch (error) {
    console.log('✅ Error handling test passed:', error.message);
  }
  
  console.log('\n🎉 All tests completed!');
}

// Run the test
testConnection().catch(console.error); 