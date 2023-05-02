import type { Event, EventGuest } from "@prisma/client";
import { Gender } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {  json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { parseFormAny } from "react-zorm";
import { z } from "zod";

import { AddGuestComponent, GuestListComponent, NewEventGuestFormSchema } from "~/components/event";
import { commitAuthSession, requireAuthSession } from "~/modules/auth";
import { getEvent } from "~/modules/event";
import { addEventGuest, checkInEventGuest } from "~/modules/guest/event";
import { assertIsPostOrPatch, getRequiredParam } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = (await getEvent(id));
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
}

export async function action({ request, params }: ActionArgs) {
  assertIsPostOrPatch(request);
  const eventId = getRequiredParam(params, "eventId");
  const authSession = await requireAuthSession(request);

  const formData = await request.formData();

  let guestId = formData.get("guestId");

  if(guestId != null) { 
    await checkInEventGuest(guestId.toString());
    return null;
  }

  const result = await NewEventGuestFormSchema.safeParseAsync(parseFormAny(formData));

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

  await addEventGuest({ name: name, gender: gender, userId: authSession.userId, eventId: eventId});
  
  return null;
}

export default function GuestsManagement() {
  const { event } = useLoaderData<typeof loader>();

  const guests = event.guests as unknown as EventGuest[];

  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
    {Object.values(Gender).map((gender) => (
      <div key={gender} className="flex max-w-xl flex-col items-start justify-between">
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              {gender}
          </h3>
          <AddGuestComponent event={event as unknown as Event} gender={gender} />
          <GuestListComponent guests={guests.filter((g) => g.gender == gender)} frontDoorMode={true} />
          
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
