export interface NumberInputValidatorOptions {
  min?: number;
  max?: number;
}

export class NumberInputValidator {
  static create(options?: NumberInputValidatorOptions) {
    return new NumberInputValidator(options?.min, options?.max);
  }

  private static validateRe = /[-0-9.]/;

  private constructor(
    private min?: number,
    private max?: number,
  ) {}

  validate(key: string, value: string): boolean {
    if (!NumberInputValidator.validateRe.test(key)) return false;
    if (key === '.' && (value.includes('.') || value.length === 0)) return false;
    if (key === '-' && value.length > 0) return false;
    return true;
  }

  serialize(value: number | null): string {
    return value ? String(value) : '';
  }

  deserialize(value: string): number | null {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    if (this.min !== undefined && num < this.min) return this.min;
    if (this.max !== undefined && num > this.max) return this.max;

    return num;
  }
}
