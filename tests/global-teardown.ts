import {cleanupEncryptedKeyFile} from './helpers/auth';

/**
 * Global teardown for Playwright tests
 * Cleans up the encrypted API key file after tests
 */
async function globalTeardown() {
  console.log('🧹 Cleaning up encrypted API key file...');
  cleanupEncryptedKeyFile();
  console.log('✅ Cleanup complete');
}

export default globalTeardown;
