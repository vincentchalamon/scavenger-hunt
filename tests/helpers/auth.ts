import {Page} from '@playwright/test';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test password for encrypted API key
 */
export const TEST_PASSWORD = 'TestPlaywright2026!';

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts a string with a password using AES-GCM
 */
export function encryptApiKey(plaintext: string, password: string): string {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(password, salt);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine salt + IV + authTag + encrypted data
  const combined = Buffer.concat([salt, iv, authTag, encrypted]);

  // Convert to base64
  return combined.toString('base64');
}

/**
 * Creates an encrypted API key file for testing
 */
export function createEncryptedKeyFile(apiKey: string, password: string = TEST_PASSWORD): string {
  const encrypted = encryptApiKey(apiKey, password);
  const outDir = path.join(process.cwd(), 'out');
  const filePath = path.join(outDir, 'encrypted-api-key.txt');

  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(filePath, encrypted, 'utf8');
  return filePath;
}

/**
 * Cleans up the encrypted API key file after testing
 */
export function cleanupEncryptedKeyFile(): void {
  const filePath = path.join(process.cwd(), 'out', 'encrypted-api-key.txt');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Helper to unlock the application with password in tests
 */
export async function unlockApplication(page: Page, password: string = TEST_PASSWORD): Promise<void> {
  // Wait for password input to be visible
  const passwordInput = page.getByPlaceholder(/Entrez le mot de passe|Enter password|Mot de passe|Password/i);
  await passwordInput.waitFor({ state: 'visible', timeout: 15000 });

  // Fill in the password
  await passwordInput.fill(password);

  // Click the unlock button
  const unlockButton = page.getByRole('button', { name: /Déverrouiller|Unlock/i });
  await unlockButton.click();

  // Wait for the password input to disappear (successful unlock)
  await passwordInput.waitFor({ state: 'hidden', timeout: 30000 });
}
