import { EventType } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import dayjs from "dayjs";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { requireAuthSession, commitAuthSession } from "~/modules/auth";
import { deleteEvent, getEvent, updateEvent } from "~/modules/event";
import {
  assertIsPatchOrDelete,
  getRequiredParam,
  isAllowedToEditEvents,
  isDelete,
  isFormProcessing,
} from "~/utils";

export const EditEventFormSchema = z.object({
  title: z.string().min(2, "require-title"),
  date: z.string(),
  eventType: z.nativeEnum(EventType),
});

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = await getEvent(id);
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
}

export async function action({ params, request }: LoaderArgs) {
  assertIsPatchOrDelete(request);
  const authSession = await requireAuthSession(request);

  const eventId = getRequiredParam(params, "eventId");

  if (!isAllowedToEditEvents(authSession.user.role)) {
    return redirect(`/dashboard/${authSession.organization.id}`);
  }

  if(isDelete(request)) {
    await deleteEvent(eventId);
    return redirect(`/dashboard/${authSession.organization.id}`);
  }

  const formData = await request.formData();
  const result = await EditEventFormSchema.safeParseAsync(
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

  const { title, date, eventType } = result.data;

  const event = await updateEvent({
    id: eventId,
    title,
    date: dayjs(date).toDate(),
    eventType,
  });

  return redirect(`/events/${authSession.organization.id}/event/${event.id}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
}

export default function EditEventPage() {
  const zo = useZorm("NewQuestionWizardScreen", EditEventFormSchema);
  const transition = useTransition();
  const disabled = isFormProcessing(transition.state);
  const { event } = useLoaderData<typeof loader>();

  return (
    <>
      <Form
        ref={zo.ref}
        method="patch"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              name={zo.fields.title()}
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              defaultValue={event.title}
              disabled={disabled}
            />
          </label>
          {zo.errors.title()?.message && (
            <div className="pt-1 text-red-700" id="title-error">
              {zo.errors.title()?.message}
            </div>
          )}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Date: </span>
            <input
              type="datetime-local"
              name={zo.fields.date()}
              className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
              disabled={disabled}
              defaultValue={dayjs(event.date).format("YYYY-MM-DDTHH:mm")}
            />
          </label>
          {zo.errors.date()?.message && (
            <div className="pt-1 text-red-700" id="body-error">
              {zo.errors.date()?.message}
            </div>
          )}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>EventType: </span>
            <select
              name={zo.fields.eventType()}
              id="eventType"
              defaultValue={event.eventType}
            >
              <option value="SOCIAL">SOCIAL</option>
              <option value="PARTY">PARTY</option>
              <option value="SEMIFORMAL">SEMIFORMAL</option>
            </select>
          </label>
          {zo.errors.eventType()?.message && (
            <div className="pt-1 text-red-700" id="body-error">
              {zo.errors.eventType()?.message}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white focus:bg-blue-400 hover:bg-blue-600"
            disabled={disabled}
          >
            Save
          </button>
        </div>
      </Form>
      <Form
        method="delete"
      >
        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-red-500 px-4 py-2 text-white focus:bg-red-400 hover:bg-red-600"
            disabled={disabled}
          >
            Delete
          </button>
        </div>
      </Form>
    </>
  );
}
