import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/index.js';
import { ApplicationError } from '../libs/rest/index.js';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0): number {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count?: number): T[] {
  if (count === undefined) {
    const startPosition = generateRandomValue(0, items.length - 1);
    const endPosition = startPosition + generateRandomValue(startPosition, items.length);
    return items.slice(startPosition, endPosition);
  }

  const safeCount = Math.min(count, items.length);
  const startPosition = generateRandomValue(0, items.length - safeCount);
  return items.slice(startPosition, startPosition + safeCount);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(dto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorField[] = []
) {
  return { errorType, error, details };
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}
