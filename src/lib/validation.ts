export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-4, where 4 is strongest
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common patterns check
  const commonPatterns = [
    '123456',
    'password',
    'qwerty',
    'abc123',
    'admin123',
    'letmein'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push('Password contains common patterns that are easily guessed');
    score = Math.max(0, score - 1);
  }

  // Repeated characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters (more than 2 times)');
    score = Math.max(0, score - 1);
  }

  // Sequential characters check
  const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789'];
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const chunk = seq.slice(i, i + 3);
      if (password.toLowerCase().includes(chunk)) {
        errors.push('Password should not contain sequential characters');
        score = Math.max(0, score - 1);
        break;
      }
    }
  }

  // Normalize score to 0-4 range
  score = Math.max(0, Math.min(4, score));

  return {
    isValid: errors.length === 0,
    errors,
    score
  };
}

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-lime-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
}

export function getPasswordStrengthText(score: number): string {
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Strong';
    case 4:
      return 'Very Strong';
    default:
      return 'Invalid';
  }
}
