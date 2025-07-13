import z, { ZodError, ZodObject } from 'zod';

export class ValidationError {
  message: string;
  code: number;

  constructor(message: string, code: number) {
    this.message = message;
    this.code = code;
  }
}

export function validateBody<T extends ZodObject>(data: unknown, schema: T): z.output<T> {
  if (typeof data !== 'object') throw new ValidationError('Тело запроса должно быть объектом', 422);
  if (data === null) throw new ValidationError('Отсутствует тело запроса', 422);

  const fields = Object.keys(schema.shape);

  const missingFields = fields.filter((field) => !data.hasOwnProperty(field));
  if (missingFields.length > 0)
    throw new ValidationError(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`, 422);

  try {
    const parsedData = schema.parse(data);
    return parsedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const parsedError = JSON.parse(error.message)[0];

      throw new ValidationError(
        `Ошибка в поле: ${parsedError.path}. ${parsedError.message.replace('Invalid input: expected', 'Ожидается тип:').replace('received', 'но получен:')}`,
        422
      );
    }
    throw new ValidationError('Ошибка сервера', 500);
  }
}

export function validateSortParams(sort: string | null): 'asc' | 'desc' | undefined {
  if (!sort) {
    return undefined;
  }

  if (!['asc', 'desc'].includes(sort)) {
    throw new ValidationError('Недопустимый параметр сортировки. Допустимые значения: asc или desc', 422);
  }

  return sort as 'asc' | 'desc';
}
