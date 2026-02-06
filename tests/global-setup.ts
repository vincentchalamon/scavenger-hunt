import {createEncryptedKeyFile, TEST_PASSWORD} from './helpers/auth';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Global setup for Playwright tests
 * Creates the encrypted API key file before running tests
 */
async function globalSetup() {
  // Load environment variables
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  GOOGLE_MAPS_API_KEY not found in environment variables');
    console.warn('⚠️  Using dummy API key for testing (maps features will not work)');
    // Create a dummy encrypted key file so tests can at least run
    const dummyApiKey = 'DUMMY_API_KEY_FOR_TESTING';
    const filePath = createEncryptedKeyFile(dummyApiKey, TEST_PASSWORD);
    console.log(`✅ Encrypted dummy API key created at: ${filePath}`);
    console.log(`🔑 Test password: ${TEST_PASSWORD}`);
    return;
  }

  console.log('🔐 Creating encrypted API key file for tests...');
  const filePath = createEncryptedKeyFile(apiKey, TEST_PASSWORD);
  console.log(`✅ Encrypted API key created at: ${filePath}`);
  console.log(`🔑 Test password: ${TEST_PASSWORD}`);
}

export default globalSetup;
