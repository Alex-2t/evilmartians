import { User } from '.';

export const enum Codes {
  SUCCESS = 'success',
  VALIDATION_ERROR = 'validation_error',
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_VERIFIED = 'email_not_verified',

  INTERNAL_ERROR = 'internal_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  UNKNOWN_ERROR = 'unknown_error',
}

export type AuthSuccessResponse = {
  status: number;
  code: Codes.SUCCESS;
  message: string;
  user: User;
};

export const authSuccessGuard = (v: Response): v is AuthSuccessResponse => {
  return v.code === Codes.SUCCESS;
};

interface ValidationError {
  status: number;
  code: Codes.VALIDATION_ERROR;
  message: string;
  fields: {
    email?: string;
    password?: string;
  };
}

export type AuthErrorResponse =
  | ValidationError
  | {
      status: number;
      code: Exclude<Codes, Codes.SUCCESS | Codes.VALIDATION_ERROR>;
      message: string;
    };

export const authErrorGuard = (v: Response): v is AuthErrorResponse => {
  return v.code !== Codes.SUCCESS;
};

export type Response = AuthSuccessResponse | AuthErrorResponse;

export const authResponseGuard = (v: unknown): v is Response => {
  return typeof v === 'object' && v !== null && 'code' in v && 'status' in v && 'message' in v;
};

export const isValidationError = (v: Response): v is ValidationError =>
  v.code === Codes.VALIDATION_ERROR;
