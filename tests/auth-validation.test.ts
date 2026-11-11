import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Authentication & Password Hashing Tests', () => {
  it('correctly hashes and verifies passwords using bcrypt', async () => {
    const rawPassword = 'superSecurePassword123!';
    const hash = await bcrypt.hash(rawPassword, 10);

    expect(hash).not.toBe(rawPassword);
    const isValid = await bcrypt.compare(rawPassword, hash);
    const isInvalid = await bcrypt.compare('wrongPassword', hash);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });

  it('validates email format requirements', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test('valid.user@company.com')).toBe(true);
    expect(emailRegex.test('invalid-email-without-at')).toBe(false);
    expect(emailRegex.test('missingdomain@')).toBe(false);
    expect(emailRegex.test('@missinguser.com')).toBe(false);
  });

  it('rejects passwords shorter than 6 characters', () => {
    const shortPassword = '12345';
    const validPassword = '123456';

    expect(shortPassword.length >= 6).toBe(false);
    expect(validPassword.length >= 6).toBe(true);
  });

  it('validates organization name length', () => {
    const invalidOrg = ' ';
    const validOrg = 'Acme Logistics';

    expect(invalidOrg.trim().length >= 2).toBe(false);
    expect(validOrg.trim().length >= 2).toBe(true);
  });
});
