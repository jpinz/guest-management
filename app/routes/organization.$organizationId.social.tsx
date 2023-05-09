import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import { SocialUserComponent } from "~/components/user";
import type { User } from "~/database";
import { requireAuthSession } from "~/modules/auth";
import { getUsesrByOrganization } from "~/modules/user";
import { isAllowedToEditOrganization } from "~/utils";
import { getRequiredParam } from "~/utils/http.server";

export async function loader({ request, params }: LoaderArgs) {
  const organizationId = getRequiredParam(params, "organizationId");

  const { user } = await requireAuthSession(request);

  if (user.organizationId !== organizationId && isAllowedToEditOrganization(user.role)) {
    // You can't do this!
    return redirect(`/dashboard/${user.organizationId}`);
  }

  const users = await getUsesrByOrganization(organizationId);

  return json({
    users
  });
}

export default function SocialPage() {
  const { users } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">test</h3>
      {(users as unknown as User[]).map((user) => (<SocialUserComponent key={user.id} user={user} manageSocialStatus={true} manageUser={true} />))}
      <Outlet />
    </div>
  );
}
