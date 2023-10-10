import { Role } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import clsx from "clsx";

import type { User } from "~/database";
import { requireAuthSession } from "~/modules/auth";
import { getRoleClass, getUsesrByOrganization, updateUser } from "~/modules/user";
import {
  isAllowedToEditOrganization,
  isAllowedToEditSocialPermissions,
} from "~/utils";
import { getRequiredParam } from "~/utils/http.server";

export async function loader({ request, params }: LoaderArgs) {
  const organizationId = getRequiredParam(params, "organizationId");

  const { user } = await requireAuthSession(request);

  if (
    user.organizationId !== organizationId &&
    isAllowedToEditSocialPermissions(user.role)
  ) {
    // You can't do this!
    return redirect(`/dashboard/${user.organizationId}`, {
      status: 403,
    });
  }

  const users = await getUsesrByOrganization(organizationId);

  return json({
    authedUser: user,
    users,
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  let id = formData.get("user[id]")!.toString();
  let hasSocialPermission = undefined;
  if(formData.has("user[hasSocialPermission]")) {
    console.log("Has social permission value")
     hasSocialPermission = formData.get("user[hasSocialPermission]")?.toString().toLowerCase() === 'true' ? true : false;
  }
  let role = formData.get("user[role]") != null ? formData.get("user[role]")!.toString() as Role : undefined;

  await updateUser({id: id, role: role, hasSocialPermission: hasSocialPermission});

  return new Response("OK");
}

export default function SocialPage() {
  const { authedUser, users } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  
  function handleChange(event: any) {
    event.preventDefault();
    console.log(event.target.form);
    submit(event.target.form);
  }
  
  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rush Class
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Graduating Year
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role(s)
                  </th>
                  {isAllowedToEditSocialPermissions(authedUser.role) && (
                      <th
                      scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Has Social Permissions
                        </th>
                        )}
                  {isAllowedToEditOrganization(authedUser.role) && (
                      <>
                        <th
                      scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Is Verified
                        </th>
                        <th
                      scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Set Roles
                        </th>
                      </>
                    )}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(users as unknown as User[]).map((user) => (<tr key={user.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="mt-1 text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{user.rushClass}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{user.gradYear}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span
                        className={clsx(
                          getRoleClass(user.role),
                          "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    {isAllowedToEditSocialPermissions(authedUser.role) && (
                      <td>
                        <Form
                          method="post"
                          action={`/organization/${user.organizationId}/social`}
                          onChange={handleChange}
                        >
                          <input type="hidden" name="user[id]" value={user.id} />
                          <input
                            id="hasSocialPermission"
                            name="user[hasSocialPermission]"
                            defaultChecked={user.hasSocialPermission}
                            type="checkbox"
                            value={((!user.hasSocialPermission) ?? false).toString()}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </Form>
                      </td>
                    )}
                    {isAllowedToEditOrganization(authedUser.role) && (
                      <>
                        <td>
                          {(user.role == "UNVERIFIED" && (
                            <Form
                              method="post"
                              action={`/organization/${user.organizationId}/social`}
                            >
                              <button
                                type="submit"
                                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                              >
                                Verify Account
                                <span className="sr-only">, {user.name}</span>
                              </button>
                            </Form>
                          )) || <span>Verified</span>}
                        </td>
                        <td>
                          <Form
                            method="post"
                            action={`/organization/${user.organizationId}/social`}
                            onChange={handleChange}
                          >
                            <input
                              type="hidden"
                              name="user[id]"
                              value={user.id}
                              readOnly={true}
                            />
                            <select
                              defaultValue={user.role}
                              name="user[role]"
                            >
                              {Object.values(Role)
                                .slice(1)
                                .map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                            </select>
                          </Form>
                        </td>
                      </>
                    )}
                  </tr>)
              
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
