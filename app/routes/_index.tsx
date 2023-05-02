import type { Organization } from "@prisma/client";
import { Role } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { getAuthSession } from "~/modules/auth";
import { getOrganizations } from "~/modules/organization";

export async function loader({ request }: LoaderArgs) {
  const { email, user } = (await getAuthSession(request)) || {};

  if (!user) {
    return json({ email, organizationId: null, organizations: null });
  }

  if (user?.role === Role.ADMIN) {
    const allOrganizations = await getOrganizations();

    return json({
      email,
      organizationId: user!.organizationId,
      organizations: allOrganizations,
    });
  }

  return json({
    email,
    organizationId: user?.organizationId,
    organizations: null,
  });
}

export default function Index() {
  const { email, organizationId, organizations } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation(["common", "auth"]);
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {email && organizationId ? (
          <div className="space-y-4">
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                to={`/dashboard/${organizationId}`}
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
              >
                View Dashboard for {email}
              </Link>

              {organizations !== null ? (
                <ol>
                  {organizations.map((organization: Organization) => (
                    <li key={organization.id}>
                      <Link
                        className={`block border-b p-4 text-xl `}
                        to={`/dashboard/${organization.id}`}
                      >
                        🎉 {organization.name} - {organization.contactEmail}
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                data-test-id="join"
                to="/join"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
              >
                {t("register.action", { ns: "auth" })}
              </Link>
              <Link
                data-test-id="login"
                to="/login"
                className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600  "
              >
                {t("login.action", { ns: "auth" })}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
