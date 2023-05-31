import { EventType } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import dayjs from "dayjs";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { requireAuthSession, commitAuthSession } from "~/modules/auth";
import { createEvent } from "~/modules/event";
import { assertIsPost, isAllowedToEditEvents, isFormProcessing } from "~/utils";

export const NewEventFormSchema = z.object({
  title: z.string().min(2, "require-title"),
  date: z.string(),
  eventType: z.nativeEnum(EventType),
});

export async function action({ request }: LoaderArgs) {
  assertIsPost(request);
  const authSession = await requireAuthSession(request);

  if (!isAllowedToEditEvents(authSession.user.role)) {
    return redirect(`/dashboard/${authSession.organization.id}`);
  }

  const formData = await request.formData();
  const result = await NewEventFormSchema.safeParseAsync(
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

  const event = await createEvent({
    title,
    date: dayjs(date).toDate(),
    eventType,
    organizationId: authSession.organization.id,
  });

  return redirect(`/events/${authSession.organization.id}/event/${event.id}/guests`, {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
}

export default function NewEventPage() {
  const zo = useZorm("NewQuestionWizardScreen", NewEventFormSchema);
  const transition = useTransition();
  const disabled = isFormProcessing(transition.state);

  return (
    <Form ref={zo.ref} method="post" className="mx-4 space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Event Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Please input details about the event.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="event-title"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Event Title
            </label>
            <div className="mt-2">
              <input
                name={zo.fields.title()}
                disabled={disabled}
                type="text"
                id="event-title"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {zo.errors.title()?.message && (
              <div className="pt-1 text-red-700" id="title-error">
                {zo.errors.title()?.message}
              </div>
            )}
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="event-date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                id="event-date"
                type="datetime-local"
                name={zo.fields.date()}
                disabled={disabled}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {zo.errors.date()?.message && (
              <div className="pt-1 text-red-700" id="body-error">
                {zo.errors.date()?.message}
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="event-type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Type
            </label>
            <div className="mt-2">
              <select
                id="event-type"
                name={zo.fields.eventType()}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="SOCIAL">SOCIAL</option>
                <option value="PARTY">PARTY</option>
                <option value="SEMIFORMAL">SEMIFORMAL</option>
              </select>
            </div>
            {zo.errors.eventType()?.message && (
              <div className="pt-1 text-red-700" id="body-error">
                {zo.errors.eventType()?.message}
              </div>
            )}
          </div>
        </div>
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
  );
}
