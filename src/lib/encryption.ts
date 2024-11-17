import crypto from 'crypto';
import { logger } from './server/logger';

const ENCRYPTION_KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const ALGORITHM = 'aes-256-gcm';

interface EncryptedData {
  encryptedValue: string;
  iv: string;
  authTag: string;
}

export function getEncryptionKey(key: string): Buffer {
  try {
    logger.debug('Deriving encryption key', { keyLength: ENCRYPTION_KEY_LENGTH });
    // Ensure the key is the correct length using PBKDF2
    return crypto.pbkdf2Sync(
      key,
      'yubidive-salt', // Static salt, could be made configurable via env
      100000, // Number of iterations
      ENCRYPTION_KEY_LENGTH,
      'sha256'
    );
  } catch (error) {
    logger.error('Failed to derive encryption key', { error });
    throw new Error('Failed to derive encryption key');
  }
}

export function encrypt(text: string, key: string): EncryptedData {
  try {
    logger.debug('Starting encryption process');
    const derivedKey = getEncryptionKey(key);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

    let encryptedValue = cipher.update(text, 'utf8', 'hex');
    encryptedValue += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    const result = {
      encryptedValue,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };

    logger.debug('Encryption successful', {
      ivLength: iv.length,
      authTagLength: authTag.length,
      encryptedLength: encryptedValue.length
    });

    return result;
  } catch (error) {
    logger.error('Encryption failed', { error });
    throw new Error('Encryption failed');
  }
}

export function decrypt(
  encryptedData: EncryptedData,
  key: string
): string {
  try {
    logger.debug('Starting decryption process', {
      ivLength: encryptedData.iv.length / 2,
      authTagLength: encryptedData.authTag.length / 2
    });

    const derivedKey = getEncryptionKey(key);
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      derivedKey,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    logger.debug('Decryption successful', {
      decryptedLength: decrypted.length
    });

    return decrypted;
  } catch (error) {
    logger.error('Decryption failed', { error });
    throw new Error('Decryption failed. Data may be corrupted or key is incorrect.');
  }
}

export function parseEncryptedData(encryptedString: string): EncryptedData {
  try {
    logger.debug('Parsing encrypted data string', {
      stringLength: encryptedString.length
    });

    const [encryptedValue, iv, authTag] = encryptedString.split('.');
    
    if (!encryptedValue || !iv || !authTag) {
      throw new Error('Invalid encrypted data format');
    }

    const result = { encryptedValue, iv, authTag };

    logger.debug('Successfully parsed encrypted data', {
      encryptedLength: encryptedValue.length,
      ivLength: iv.length,
      authTagLength: authTag.length
    });

    return result;
  } catch (error) {
    logger.error('Failed to parse encrypted data', { error, encryptedString });
    throw new Error('Invalid encrypted data format');
  }
}

export function stringifyEncryptedData(data: EncryptedData): string {
  try {
    logger.debug('Stringifying encrypted data', {
      encryptedLength: data.encryptedValue.length,
      ivLength: data.iv.length,
      authTagLength: data.authTag.length
    });

    const result = `${data.encryptedValue}.${data.iv}.${data.authTag}`;

    logger.debug('Successfully stringified encrypted data', {
      resultLength: result.length
    });

    return result;
  } catch (error) {
    logger.error('Failed to stringify encrypted data', { error });
    throw new Error('Failed to stringify encrypted data');
  }
}
