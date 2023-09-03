import { useState } from 'react'

import { Listbox } from "@headlessui/react";
import { Role } from "@prisma/client";
import clsx from "clsx";
import dayjs from "dayjs";

import type { User } from "~/database";
import { getRoleClass } from "~/modules/user";

var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

export function SocialUserComponent(props: {
  user: User;
  manageSocialStatus: boolean;
  manageUser: boolean;
}) {
  const user = props.user;
  const [userRole, setUserRole] = useState(user.role);

  return (
    <tr key={user.id}>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
        <div className="flex items-center">
          <div className="font-medium text-gray-900">{user.name}</div>
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
            getRoleClass(userRole),
            "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
          )}
        >
          {userRole}
        </span>
      </td>
      {props.manageSocialStatus && (
        <td>
          {/* checkbox */}
          <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
        </td>
      )}
      {props.manageUser && (
        <>
          <td>
            {(userRole == "UNVERIFIED" && (
              <form
                method="post"
                action={`/organization/${user.organizationId}/social`}
              >
                <button
                  type="submit"
                  className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >
                  Verify Account<span className="sr-only">, {user.name}</span>
                </button>
              </form>
            )) || <span>Verified</span>}
          </td>
          <td>
            <form
              method="post"
              action={`/organization/${user.organizationId}/social`}
            >
              <input type="hidden" name="user[id]" value={user.id} />
              <Listbox
                value={userRole}
                onChange={setUserRole}
                name="user[role]"
              >
                <Listbox.Button>{userRole}</Listbox.Button>
                <Listbox.Options>
                  {Object.values(Role)
                    .slice(1)
                    .map((role) => (
                      <Listbox.Option key={role} value={role}>
                        {role}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Listbox>
            </form>
          </td>
        </>
      )}
    </tr>
  );
}
