/**
 * Client-side encryption/decryption utilities using Web Crypto API
 * AES-GCM encryption with password-based key derivation (PBKDF2)
 */

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string with a password using AES-GCM
 * @param plaintext - The text to encrypt
 * @param password - The password to use for encryption
 * @returns Base64 encoded encrypted data with salt and IV
 */
export async function encryptApiKey(plaintext: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(plaintext)
  );

  // Combine salt + IV + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts an encrypted string with a password
 * @param encryptedBase64 - The base64 encoded encrypted data
 * @param password - The password to use for decryption
 * @returns The decrypted plaintext
 * @throws Error if decryption fails (wrong password or corrupted data)
 */
export async function decryptApiKey(encryptedBase64: string, password: string): Promise<string> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    // Extract salt, IV, authTag, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const authTag = combined.slice(28, 44);
    const encryptedData = combined.slice(44);

    const key = await deriveKey(password, salt);

    // Combine encrypted data with auth tag for AES-GCM
    const dataWithTag = new Uint8Array(encryptedData.length + authTag.length);
    dataWithTag.set(encryptedData, 0);
    dataWithTag.set(authTag, encryptedData.length);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128,
      },
      key,
      dataWithTag
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    throw new Error('Decryption failed: Invalid password or corrupted data');
  }
}
