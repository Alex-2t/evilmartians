'use client';

import { useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '@store/authAtoms';
import EyeIcon from '@assets/icons/eyeIcon.svg';
import {
  authErrorGuard,
  AuthErrorResponse,
  authResponseGuard,
  isValidationError,
} from '@customTypes/auth';
import EyeSlashIcon from '@assets/icons/eyeSlashIcon.svg';
import { signIn } from '@api/auth';
import { Email } from '@customTypes/index';
import { Codes } from '@customTypes/auth';
import { getResponseByCode } from '@api/mocks';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { validateEmailGuard, validatePasword } from '@utils/validation';
import { omit } from 'lodash';

export default function Login() {
  const [auth, setAuth] = useAtom(authAtom);

  const [rememberMe, setRememberMe] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const getFieldsWithError = (types: ('email' | 'password')[] = ['email', 'password']) => {
    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    let fields: { email?: string; password?: string } =
      auth.type === 'error' && isValidationError(auth.payload) ? auth.payload.fields : {};

    if (types.includes('email')) {
      fields = omit(fields, 'email');

      if (email === '') {
        fields = {
          ...fields,
          email: 'Email is required',
        };
      }
      if (!validateEmailGuard(email)) {
        fields = {
          ...fields,
          email: 'Please enter a valid email address',
        };
      }
    }

    if (types.includes('password')) {
      fields = omit(fields, 'password');

      if (password === '') {
        fields = {
          ...fields,
          password: 'Password is required',
        };
      }
      if (!validatePasword(password)) {
        fields = {
          ...fields,
          password: 'Password must be at least 8 characters',
        };
      }
    }

    if (Object.keys(fields).length > 0) {
      return fields;
    }

    return undefined;
  };

  const checkValidation = (types: ('email' | 'password')[] = ['email', 'password']) => {
    const fields = getFieldsWithError(types);

    if (fields) {
      setAuth({
        type: 'error',
        payload: {
          ...getResponseByCode(Codes.VALIDATION_ERROR),
          fields,
        },
      });

      return;
    }

    setAuth({ type: 'idle' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = getFieldsWithError();
    if (fields) {
      setAuth({
        type: 'error',
        payload: {
          ...getResponseByCode(Codes.VALIDATION_ERROR),
          fields,
        },
      });

      return;
    }

    // we already checked if it's a valid email
    const email = emailRef.current?.value as Email;
    const password = passwordRef.current?.value as string;

    setAuth({
      type: 'loading',
    });

    try {
      const data = await signIn({ email, password, rememberMe });

      setAuth({
        type: 'success',
        payload: data,
      });
    } catch (e: unknown) {
      const payload: AuthErrorResponse =
        authResponseGuard(e) && authErrorGuard(e)
          ? e
          : {
              status: 400,
              code: Codes.UNKNOWN_ERROR,
              message: 'Unknown Error occurred',
            };

      setAuth({
        type: 'error',
        payload,
      });
    }
  };

  const emailErrorMsg =
    auth.type === 'error' && isValidationError(auth.payload) && auth.payload.fields?.email;
  const passwordErrorMsg =
    auth.type === 'error' && isValidationError(auth.payload) && auth.payload.fields?.password;

  const disableSubmitBtn =
    auth.type === 'loading' || (auth.type === 'error' && isValidationError(auth.payload));

  return (
    <div className='min-h-screen select-none flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h1 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Sign in to your account
        </h1>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {((auth.type === 'error' && !isValidationError(auth.payload)) ||
            auth.type === 'success') && (
            <div
              className={classNames('mb-4  px-4 py-3 rounded relative', {
                'text-red-700 bg-red-50 border border-red-200': auth.type === 'error',
                'text-green-700 bg-green-50 border border-green-200': auth.type === 'success',
              })}
              role='alert'
            >
              <span className='block sm:inline'>{auth.payload.message}</span>
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  ref={emailRef}
                  required
                  onBlur={() => checkValidation(['email'])}
                  onChange={() => {
                    if (
                      auth.type === 'error' &&
                      isValidationError(auth.payload) &&
                      auth.payload.fields?.email
                    ) {
                      checkValidation(['email']);
                    }
                  }}
                  className={twMerge(
                    classNames(
                      'appearance-none text-gray-900 block w-full border-gray-300 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400',
                      'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                      { 'border-red-300': emailErrorMsg },
                    ),
                  )}
                  placeholder='you@example.com'
                  aria-invalid={emailErrorMsg ? 'true' : 'false'}
                  aria-describedby={emailErrorMsg ? 'email-error' : undefined}
                />
                {emailErrorMsg && (
                  <p id='email-error' className='mt-2 text-sm text-red-600'>
                    {emailErrorMsg}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
              </div>
              <div className='mt-1 relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  ref={passwordRef}
                  onBlur={() => checkValidation(['password'])}
                  onChange={() => {
                    if (
                      auth.type === 'error' &&
                      isValidationError(auth.payload) &&
                      auth.payload.fields?.password
                    ) {
                      checkValidation(['password']);
                    }
                  }}
                  className={twMerge(
                    classNames(
                      'appearance-none text-gray-900 border-gray-300 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400',
                      'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10',
                      { 'border-red-300': passwordErrorMsg },
                    ),
                  )}
                  placeholder='Your password'
                  aria-invalid={passwordErrorMsg ? 'true' : 'false'}
                  aria-describedby={passwordErrorMsg ? 'password-error' : undefined}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center h-[38px] cursor-pointer'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className='w-5 h-5' fill='text-gray-500' />
                  ) : (
                    <EyeIcon className='w-5 h-5' fill='text-gray-500' />
                  )}
                </button>
                {passwordErrorMsg && (
                  <p id='password-error' className='mt-2 text-sm text-red-600'>
                    {passwordErrorMsg}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-start gap-[5px]'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div>
              <button
                type='submit'
                disabled={disableSubmitBtn}
                aria-disabled={disableSubmitBtn}
                className={twMerge(
                  classNames(
                    'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                    {
                      'bg-indigo-300 cursor-not-allowed': disableSubmitBtn,
                      'bg-indigo-600 hover:bg-indigo-700': !disableSubmitBtn,
                    },
                  ),
                )}
              >
                {auth.type === 'loading' ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
