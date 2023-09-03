import { CalendarIcon, GiftIcon, PencilIcon } from "@heroicons/react/20/solid";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";

import { requireAuthSession, commitAuthSession } from "~/modules/auth";
import { deleteEvent, getEvent, setEventOpen } from "~/modules/event";
import {
  assertIsDelete,
  assertIsPatchOrDelete,
  getRequiredParam,
  isAllowedToEditEvents,
  isDelete,
  isPatch,
} from "~/utils";

var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = await getEvent(id);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
}

export async function action({ request, params }: ActionArgs) {
  console.log("Action");
  assertIsPatchOrDelete(request);
  const eventId = getRequiredParam(params, "eventId");
  const authSession = await requireAuthSession(request);

  if (!isAllowedToEditEvents(authSession.user.role)) {
    return redirect(`/dashboard/${authSession.organization.id}`);
  }

  if (isDelete(request)) {
    await deleteEvent(eventId);

    return redirect(`/dashboard/${authSession.organization.id}`, {
      headers: {
        "Set-Cookie": await commitAuthSession(request, { authSession }),
      },
    });
  }

  if (isPatch(request)) {

    const formData = await request.formData();

    const isOpen = formData.get("isOpen")?.toString().toLowerCase() === 'true' ? true : false;

    await setEventOpen(eventId, isOpen);
  
    return redirect(`/dashboard/${authSession.organization.id}`, {
      headers: {
        "Set-Cookie": await commitAuthSession(request, { authSession }),
      },
    });
  }
}


export default function EventDetailsPage() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto my-4 max-w-7xl sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {event.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <GiftIcon
                className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {event.eventType}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {dayjs(event.date).format("ddd, MMM Do YYYY - hh:mm A")}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <Link to={`/events/${event.organizationId}/event/${event.id}/edit`}>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Edit
              </button>
            </Link>
          </span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Event not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
