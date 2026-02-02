#!/usr/bin/env node

/**
 * Script to encrypt the Google Maps API key with a password during build
 * Usage: node scripts/encrypt-api-key.js
 *
 * The password must be provided via the BUILD_PASSWORD environment variable
 * The API key must be provided via the GOOGLE_MAPS_API_KEY environment variable
 *
 * The encrypted key is written to public/encrypted-api-key.txt
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts a string with a password using AES-GCM
 */
function encryptApiKey(plaintext, password) {
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

// Main execution
const password = process.env.BUILD_PASSWORD;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!password) {
  console.error('❌ Error: BUILD_PASSWORD environment variable is required');
  process.exit(1);
}

if (!apiKey) {
  console.error('❌ Error: GOOGLE_MAPS_API_KEY environment variable is required');
  process.exit(1);
}

console.log('🔐 Encrypting API key...');

try {
  const encryptedKey = encryptApiKey(apiKey, password);

  // Write to public directory
  const outputPath = path.join(__dirname, '../public/encrypted-api-key.txt');
  fs.writeFileSync(outputPath, encryptedKey, 'utf8');

  console.log('✅ API key encrypted successfully');
  console.log(`📁 Encrypted key saved to: ${outputPath}`);
  console.log(`🔑 Encrypted key (first 50 chars): ${encryptedKey.substring(0, 50)}...`);
} catch (error) {
  console.error('❌ Encryption failed:', error.message);
  process.exit(1);
}
