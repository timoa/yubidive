import { encrypt, decrypt, parseEncryptedData, stringifyEncryptedData } from '../encryption';
import { ENCRYPTION_KEY } from './env';
import { logger } from './logger';

export function encryptPassword(password: string): string {
  try {
    logger.debug('Starting password encryption');

    if (!ENCRYPTION_KEY) {
      logger.error('Encryption key not found');
      throw new Error('ENCRYPTION_KEY is not set in environment variables');
    }

    const encryptedData = encrypt(password, ENCRYPTION_KEY);
    const result = stringifyEncryptedData(encryptedData);

    logger.debug('Password encryption successful', {
      resultLength: result.length
    });

    return result;
  } catch (error) {
    logger.error('Password encryption failed', { error });
    throw error;
  }
}

export function decryptPassword(encryptedPassword: string): string {
  try {
    logger.debug('Starting password decryption');

    if (!ENCRYPTION_KEY) {
      logger.error('Encryption key not found');
      throw new Error('ENCRYPTION_KEY is not set in environment variables');
    }

    const encryptedData = parseEncryptedData(encryptedPassword);
    const result = decrypt(encryptedData, ENCRYPTION_KEY);

    logger.debug('Password decryption successful', {
      resultLength: result.length
    });

    return result;
  } catch (error) {
    logger.error('Password decryption failed', { error });
    throw error;
  }
}
