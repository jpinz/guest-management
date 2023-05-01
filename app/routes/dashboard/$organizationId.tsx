import { Role } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, NavLink } from "@remix-run/react";

import { LogoutButton, requireAuthSession } from "~/modules/auth";
import { getEvents } from "~/modules/event";
import { isAllowedToEditEvents } from "~/utils";
import { getRequiredParam } from "~/utils/http.server";

export async function loader({ request, params }: LoaderArgs) {
  const organizationId = getRequiredParam(params, "organizationId");

  const { user } = await requireAuthSession(request);

  if (user.organizationId !== organizationId && user.role !== Role.ADMIN) {
    // You can't do this!
    return redirect(`/dashboard/${user.organizationId}`);
  }

  const events = await getEvents(organizationId);

  return json({
    organizationId,
    events,
    allowedToEditEvents: isAllowedToEditEvents(user.role),
  });
}

export default function DashboardPage() {
  const { organizationId, events, allowedToEditEvents } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <main className="flex h-full w-full bg-white">
        {allowedToEditEvents ? (
          <Link
            to={`/events/${organizationId}/new`}
            className="block p-4 text-xl text-blue-500"
          >
            + New Event
          </Link>
        ) : null}

        <hr />

        {events.length === 0 ? (
          <p className="p-4">No events yet</p>
        ) : (
          <ol>
            {events.map((event) => (
              <li key={event.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={`/events/${organizationId}/event/${event.id}`}
                >
                  📝 {event.title}
                  {event.eventType}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
