import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import { getOrganization } from '~/modules/organization';
import { isAllowedToEditOrganization } from "~/utils";
import { getRequiredParam } from "~/utils/http.server";

export async function loader({ request, params }: LoaderArgs) {
  const organizationId = getRequiredParam(params, "organizationId");

  const { user } = await requireAuthSession(request);

  if (user.organizationId !== organizationId && isAllowedToEditOrganization(user.role)) {
    // You can't do this!
    return redirect(`/dashboard/${user.organizationId}`);
  }

  const organization = await getOrganization(organizationId);

  return json({
    organization
  });
}

export default function OrganizationPage() {
  const { organization } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{organization?.name}</h3>
      <Outlet />
    </div>
  );
}
