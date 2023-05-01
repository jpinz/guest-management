import * as React from "react";

import { EventType, Role } from '@prisma/client';
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

  if(!isAllowedToEditEvents(authSession.user.role)) {
    return redirect(`/dashboard/${authSession.organizationId}`);
  }

  const formData = await request.formData();
  const result = await NewEventFormSchema.safeParseAsync(parseFormAny(formData));

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

  const event = await createEvent({ title, date: dayjs(date).toDate(), eventType, organizationId: authSession.organizationId });
  
  return redirect(`/events/${authSession.organizationId}/event/${event.id}`, {
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
    <Form
      ref={zo.ref}
      method="post"
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
          <select name={zo.fields.eventType()} id="eventType">
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
  );
}
