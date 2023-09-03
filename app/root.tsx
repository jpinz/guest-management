import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";

import { i18nextServer } from "~/integrations/i18n";

import { LogoutButton, getAuthSession } from "./modules/auth";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { isAllowedToEditSocialPermissions } from "./utils";
import { getBrowserEnv } from "./utils/env";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Guests Social",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await getAuthSession(request);

  const locale = await i18nextServer.getLocale(request);
  return json({
    locale,
    env: getBrowserEnv(),
    user: authSession?.user,
  });
};

export default function App() {
  const { env, locale, user } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
          <h1 className="text-3xl font-bold">
            {user !== undefined ? (
              <Link to={`/dashboard/${user.organizationId}`}>Social</Link>
            ) : (
              <Link to=".">Social</Link>
            )}
          </h1>

          {user !== undefined && isAllowedToEditSocialPermissions(user.role) && (
            <Link to={`/organization/${user.organizationId}/social`}>
              Organization
            </Link>
          )}
          {user !== undefined ? <LogoutButton /> : null}
        </header>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
