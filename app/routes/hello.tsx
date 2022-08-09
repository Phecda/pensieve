import type { ActionFunction } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { createUserSession, login } from '~/services/auth.server';
import { badRequest } from '~/utils/response.server';

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 4) {
    return `Passwords must be at least 4 characters long`;
  }
}

function validateUrl(url: unknown) {
  const urls = ['/posts', '/'];
  if (typeof url === 'string' && urls.includes(url)) {
    return url;
  }
  return urls[0];
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    // loginType: string;
    username: string;
    password: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = validateUrl(form.get('redirectTo'));

  if (typeof username !== 'string' || typeof password !== 'string') {
    return badRequest<ActionData>({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest<ActionData>({ fieldErrors, fields });

  const user = await login(fields);
  if (!user)
    return badRequest<ActionData>({
      fields,
      formError: 'Username/Password combination is incorrect',
    });
  return createUserSession(user.id, redirectTo);
};

export default function HelloPage() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Greetings
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Good to see you again.
          </p>
        </div>
        <Form className="mt-8 space-y-6" method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="username-input"
                name="username"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                aria-errormessage={
                  actionData?.fieldErrors?.username
                    ? 'username-error'
                    : undefined
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? 'password-error'
                    : undefined
                }
              />
            </div>
          </div>

          <p className="text-red-600">
            {actionData?.formError ? <span>{actionData.formError}</span> : null}
            {actionData?.fieldErrors?.username ? (
              <span id="username-error">{actionData.fieldErrors.username}</span>
            ) : null}
            {actionData?.fieldErrors?.password ? (
              <span id="password-error">{actionData.fieldErrors.password}</span>
            ) : null}
          </p>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
