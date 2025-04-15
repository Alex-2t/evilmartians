import { Email } from '@customTypes/index';
import { RESPONSES } from './mocks';
import { authSuccessGuard, AuthSuccessResponse } from '@customTypes/auth';

interface SignInParams {
  email: Email;
  password: string;
  rememberMe: boolean;
}

export const signIn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  email,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  password,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rememberMe,
}: SignInParams): Promise<AuthSuccessResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const code = Math.floor(Math.random() * RESPONSES.length);
      const response = RESPONSES[code];

      if (authSuccessGuard(response)) {
        resolve(response);
        return;
      }

      reject(response);
    }, 500);
  });
};
