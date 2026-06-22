import auth from '@/common/lib/auth.js';

export async function getAuthHeaders() {
  await auth.api.signUpEmail({
    body: {
      name: 'Foo Doe',
      email: 'foo@doe.com',
      password: '12345678',
    },
  });

  const { headers } = await auth.api.signInEmail({
    body: {
      email: 'foo@doe.com',
      password: '12345678',
    },
    returnHeaders: true,
  });

  return new Headers({
    Cookie: headers
      .getSetCookie()
      .map((c) => c.split('; ')[0])
      .join('; '),
  });
}

export async function seedUsersWithEmail(
  users: {
    name: string;
    email: string;
    password: string;
  }[] = [
    {
      name: 'Foo Doe',
      email: 'foo@doe.com',
      password: '12345678',
    },
  ],
) {
  for (const user of users) {
    await auth.api.signUpEmail({
      body: user,
    });
  }

  const seedResult: {
    userId: string;
    name: string;
    headers: Headers;
  }[] = [];

  for (const user of users) {
    const { headers, response } = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: user.password,
      },
      returnHeaders: true,
    });

    seedResult.push({
      userId: response.user.id,
      name: response.user.name,
      headers: new Headers({
        Cookie: headers
          .getSetCookie()
          .map((c) => c.split('; ')[0])
          .join('; '),
      }),
    });
  }

  return seedResult;
}

export async function getSessionUser({
  email,
  password,
}: Readonly<{
  email: string;
  password: string;
}>) {
  const signedIn = await auth.api.signInEmail({
    body: { email, password },
  });

  return signedIn.user;
}

export async function getSessionCookieValue({
  email,
  password,
}: Readonly<{
  email: string;
  password: string;
}>) {
  const { headers } = await auth.api.signInEmail({
    body: { email, password },
    returnHeaders: true,
  });

  return headers
    .getSetCookie()
    .map((c) => c.split('; ')[0])
    .join('; ');
}
