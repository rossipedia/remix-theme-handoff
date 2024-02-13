import { cssBundleHref } from '@remix-run/css-bundle';
import { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { SSRThemeHandoff, useTheme } from './theme-handoff';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export default function App() {
  const [theme] = useTheme();
  return (
    <html
      lang="en"
      style={theme !== 'system' ? { colorScheme: `only ${theme}` } : undefined}
    >
      <head>
        <style>{`
        @media (prefers-color-scheme: dark) {
          :root {
            color-scheme: dark;
          }
        }
        `}</style>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <SSRThemeHandoff />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
