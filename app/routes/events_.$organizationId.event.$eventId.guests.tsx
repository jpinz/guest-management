import type { Event, EventGuest } from "@prisma/client";
import { Gender } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import {  json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";

import { AddGuestComponent, GuestListComponent } from "~/components/event";
import { requireAuthSession } from "~/modules/auth";
import { getEvent } from "~/modules/event";
import { getRequiredParam } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = (await getEvent(id));
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
}

export default function GuestsManagement() {
  const { event } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
    {Object.keys(Gender).map((gender) => (
      <div key={gender} className="flex max-w-xl flex-col items-start justify-between">
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <span className="absolute inset-0" />
              {gender}
          </h3>
          <AddGuestComponent event={event as unknown as Event} gender={gender} />
        <GuestListComponent guests={event.guests as unknown as EventGuest[]} />
          
        </div>
      </div>
    ))}
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
