import { useState } from "react";

import { Switch } from "@headlessui/react";
import { Gender } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { parseFormAny } from "react-zorm";

import {
  AddGuestComponent,
  GuestListComponent,
  NewEventGuestFormSchema,
} from "~/components/event";
import type { Event, EventGuest } from "~/database";
import { commitAuthSession, requireAuthSession } from "~/modules/auth";
import { getEvent } from "~/modules/event";
import { addEventGuest, checkInEventGuest } from "~/modules/guest/event";
import {
  assertIsPostOrPatch,
  getRequiredParam,
  isAllowedToCheckInGuest,
} from "~/utils";


export async function loader({ request, params }: LoaderArgs) {
  const authSession = await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = await getEvent(id);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event, authSession });
}

export async function action({ request, params }: ActionArgs) {
  assertIsPostOrPatch(request);
  const eventId = getRequiredParam(params, "eventId");
  const authSession = await requireAuthSession(request);

  const formData = await request.formData();

  let guestId = formData.get("guestId");

  if (guestId != null) {
    await checkInEventGuest(guestId.toString());
    return null;
  }

  const result = await NewEventGuestFormSchema.safeParseAsync(
    parseFormAny(formData)
  );

  if (!result.success) {
    return json(
      {
        errors: result.error,
      },
      {
        status: 400,
        headers: {
          "Set-Cookie": await commitAuthSession(request, { authSession }),
        },
      }
    );
  }

  const { name, gender } = result.data;

  await addEventGuest({
    name: name,
    gender: gender,
    userId: authSession.userId,
    eventId: eventId,
  });

  return null;
}

export default function GuestsManagement() {
  const { event, authSession } = useLoaderData<typeof loader>();

  const [frontDoorMode, setFrontDoorMode] = useState(false);

  const guests = event.guests as unknown as EventGuest[];

  return (
    <div>
      {isAllowedToCheckInGuest(authSession.user.role) && (
        <Switch.Group as="div" className="flex items-center justify-between">
          <span className="flex grow flex-col">
            <Switch.Label
              as="span"
              className="text-sm font-medium leading-6 text-gray-900"
              passive
            >
              Front Door Mode
            </Switch.Label>
            <Switch.Description as="span" className="text-sm text-gray-500">
              Allows you to check in guests to the event.
            </Switch.Description>
          </span>
          <Switch
            checked={frontDoorMode}
            onChange={setFrontDoorMode}
            className={clsx(
              frontDoorMode ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                frontDoorMode ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </Switch.Group>
      )}

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
        {Object.values(Gender).map((gender) => (
          <div
            key={gender}
            className="flex max-w-xl flex-col items-start justify-between"
          >
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                {gender}
              </h3>
              <AddGuestComponent
                event={event as unknown as Event}
                gender={gender}
              />
              <GuestListComponent
                guests={guests.filter((g) => g.gender == gender)}
                manageGuest={isAllowedToCheckInGuest(authSession.user.role)}
                frontDoorMode={frontDoorMode}
              />
            </div>
          </div>
        ))}
      </div>
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
