import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Outlet, Link, NavLink } from "@remix-run/react";

import { LogoutButton, requireAuthSession } from "~/modules/auth";
import { getEvents } from "~/modules/event";
import { notFound } from "~/utils/http.server";

export async function loader({ request }: LoaderArgs) {
  const { email, organizationId } = await requireAuthSession(request);

  const events = await getEvents({ organizationId });

  if (!events) {
    throw notFound(`No events with the organization id ${organizationId}`);
  }

  return json({ email, events });
}

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Events</Link>
        </h1>
        <p>{data.email}</p>
        <LogoutButton />
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {/* TODO: if the user is social or above */}
          <Link to="/events/new" className="block p-4 text-xl text-blue-500">
            + New Event
          </Link>

          <hr />

          {data.events.length === 0 ? (
            <p className="p-4">No events yet</p>
          ) : (
            <ol>
              {data.events.map((event) => (
                <li key={event.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={event.id}
                  >
                    📝 {event.title}
                    {event.eventType}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
