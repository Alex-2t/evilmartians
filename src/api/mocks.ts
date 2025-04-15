import { Codes, Response } from '@customTypes/auth';

const RESPONSES_AS_OBJ = {
  [Codes.SUCCESS]: {
    status: 200,
    code: Codes.SUCCESS,
    message: 'Successful Login',
    user: {
      id: 'mocked_user_id',
      name: 'Mock User',
      email: 'mock@example.com',
    },
  } as const,
  [Codes.VALIDATION_ERROR]: {
    status: 400,
    code: Codes.VALIDATION_ERROR,
    message: 'Email and password are required',
    fields: {
      email: 'Email is required.',
    },
  } as const,
  [Codes.INVALID_CREDENTIALS]: {
    status: 401,
    code: Codes.INVALID_CREDENTIALS,
    message: 'Email or password is incorrect',
  } as const,
  [Codes.EMAIL_NOT_VERIFIED]: {
    status: 403,
    code: Codes.EMAIL_NOT_VERIFIED,
    message: 'Email exists but not confirmed yet',
  } as const,
  [Codes.INTERNAL_ERROR]: {
    status: 500,
    code: Codes.INTERNAL_ERROR,
    message: 'Unexpected server error',
  } as const,
  [Codes.SERVICE_UNAVAILABLE]: {
    status: 503,
    code: Codes.SERVICE_UNAVAILABLE,
    message: 'Auth service is temporarily unavailable',
  } as const,
  [Codes.UNKNOWN_ERROR]: {
    status: 429,
    code: Codes.UNKNOWN_ERROR,
    message: 'Too many login attempts in a short time',
  } as const,
};

export const getResponseByCode = <T extends Codes>(code: T): (typeof RESPONSES_AS_OBJ)[T] => {
  return RESPONSES_AS_OBJ[code];
};

export const RESPONSES: Response[] = Object.values(RESPONSES_AS_OBJ).filter(
  ({ code }) => code !== Codes.VALIDATION_ERROR,
);
