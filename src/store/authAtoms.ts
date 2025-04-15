import { AuthErrorResponse, AuthSuccessResponse } from '@customTypes/auth';
import { atom } from 'jotai';

export type AuthState =
  | {
      type: 'idle';
    }
  | {
      type: 'loading';
    }
  | {
      type: 'success';
      payload: AuthSuccessResponse;
    }
  | {
      type: 'error';
      payload: AuthErrorResponse;
    };

export const authAtom = atom<AuthState>({
  type: 'idle',
});
