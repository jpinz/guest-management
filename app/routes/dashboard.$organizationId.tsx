import { PlusIcon } from "@heroicons/react/20/solid";
import { Role } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { EventListComponent } from "~/components/dashboard";
import type { EventWithPrismaGuests } from "~/database";
import { requireAuthSession } from "~/modules/auth";
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
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Events
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No Events
              </h3>
            </>
          ) : (
            <EventListComponent
              events={events as unknown as EventWithPrismaGuests[]}
              manageEvents={allowedToEditEvents}
            />
          )}
          {allowedToEditEvents ? (
            <div className="mt-6">
              <Link to={`/events/${organizationId}/new`}>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-indigo-500"
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  New Event
                </button>
              </Link>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
