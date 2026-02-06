/**
 * Password Validation Utility
 * Enforces strong password requirements for user security
 */

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4 (0=weak, 4=strong)
  errors: string[];
  suggestions: string[];
}

export interface PasswordRule {
  test: (password: string) => boolean;
  message: string;
  weight: number;
}

const PASSWORD_RULES: PasswordRule[] = [
  {
    test: (p) => p.length >= 8,
    message: "Mínimo 8 caracteres",
    weight: 1,
  },
  {
    test: (p) => /[A-Z]/.test(p),
    message: "Una letra mayúscula",
    weight: 1,
  },
  {
    test: (p) => /[a-z]/.test(p),
    message: "Una letra minúscula",
    weight: 1,
  },
  {
    test: (p) => /[0-9]/.test(p),
    message: "Un número",
    weight: 1,
  },
];

const BONUS_RULES: PasswordRule[] = [
  {
    test: (p) => p.length >= 12,
    message: "12+ caracteres",
    weight: 1,
  },
  {
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    message: "Un carácter especial (!@#$%...)",
    weight: 1,
  },
];

/**
 * Validate password against security rules
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Check required rules
  for (const rule of PASSWORD_RULES) {
    if (rule.test(password)) {
      score += rule.weight;
    } else {
      errors.push(rule.message);
    }
  }

  // Check bonus rules (suggestions, not errors)
  for (const rule of BONUS_RULES) {
    if (rule.test(password)) {
      score += rule.weight;
    } else {
      suggestions.push(rule.message);
    }
  }

  // Normalize score to 0-4
  const maxScore = PASSWORD_RULES.length + BONUS_RULES.length;
  const normalizedScore = Math.min(4, Math.round((score / maxScore) * 4));

  return {
    isValid: errors.length === 0,
    score: normalizedScore,
    errors,
    suggestions,
  };
}

/**
 * Get strength label based on score
 */
export function getPasswordStrength(score: number): {
  label: string;
  color: string;
} {
  switch (score) {
    case 0:
      return { label: "Muy débil", color: "text-red-500" };
    case 1:
      return { label: "Débil", color: "text-orange-500" };
    case 2:
      return { label: "Regular", color: "text-amber-500" };
    case 3:
      return { label: "Buena", color: "text-lime-500" };
    case 4:
      return { label: "Fuerte", color: "text-emerald-500" };
    default:
      return { label: "", color: "" };
  }
}

/**
 * Map Supabase auth errors to user-friendly Spanish messages
 */
export function getAuthErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    // Login errors
    "Invalid login credentials": "Email o contraseña incorrectos",
    invalid_credentials: "Email o contraseña incorrectos",
    "Email not confirmed": "Debes confirmar tu email para continuar",

    // Signup errors
    "User already registered": "Ya existe una cuenta con este email",
    "Password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres",
    "Unable to validate email address: invalid format":
      "Formato de email inválido",
    "Signup requires a valid password": "Debes ingresar una contraseña",

    // Rate limiting
    "For security purposes, you can only request this once every 60 seconds":
      "Por seguridad, espera 60 segundos antes de intentar de nuevo",
    "Email rate limit exceeded": "Demasiados intentos. Espera unos minutos",

    // Network errors
    "Failed to fetch": "Sin conexión. Verifica tu internet",
    NetworkError: "Error de red. Verifica tu conexión",

    // OAuth errors
    "provider is not enabled":
      "Este método de inicio de sesión no está habilitado",

    // Generic
    "An error occurred": "Ocurrió un error. Intenta de nuevo",
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return original if no match (but cleaned up)
  return error.replace(/^Error: /, "");
}
