import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import cookie from 'cookie';
import { useEffect } from 'react';
import { ThemeSchema, useTheme } from '~/theme-handoff';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const newTheme = fd.get('theme') ?? 'system';
  const parsedTheme = ThemeSchema.safeParse(newTheme);
  if (!parsedTheme.success) {
    throw new Response('Invalid theme', { status: 400 });
  }
  return json(
    { theme: parsedTheme.data },
    {
      headers: {
        'Set-Cookie': cookie.serialize('theme', String(newTheme)),
      },
    }
  );
}

export default function Index() {
  const [theme, setTheme] = useTheme();
  const newTheme = useActionData<typeof action>()?.theme;

  useEffect(() => {
    if (newTheme && newTheme !== theme) {
      setTheme(newTheme);
    }
  }, [newTheme, setTheme, theme]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      <p>
        The theme is: <code>{theme}</code>
      </p>
      <div>
        <Form method="post" reloadDocument>
          <button name="theme" value="light">
            Set light
          </button>
          <button name="theme" value="dark">
            Set dark
          </button>
          <button name="theme" value="system">
            Set system
          </button>
        </Form>
      </div>
    </div>
  );
}
