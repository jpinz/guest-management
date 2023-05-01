import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";

import { requireAuthSession, commitAuthSession } from "~/modules/auth";
import { deleteEvent, getEvent } from "~/modules/event";
import { assertIsDelete, getRequiredParam } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  await requireAuthSession(request);

  const id = getRequiredParam(params, "eventId");

  const event = await getEvent({ id });
  if (!event) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ event });
}

export async function action({ request, params }: ActionArgs) {
  assertIsDelete(request);
  const id = getRequiredParam(params, "eventId");
  const authSession = await requireAuthSession(request);

  await deleteEvent({ id });

  return redirect(`/dashboard/${authSession.organizationId}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(request, { authSession }),
    },
  });
}

export default function EventDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.event.title}</h3>
      <p className="py-6">{data.event.date}</p>
      <hr className="my-4" />
      <p className="py-6">{data.event.eventType}</p>
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
