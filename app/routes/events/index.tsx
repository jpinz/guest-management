import type { LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";

export async function loader({ request }: LoaderArgs) {
  await requireAuthSession(request);

  return null;
}

// TODO: Block create a new event for those without permission.
export default function EventIndexPage() {
  return (
    <>
      <p>
        No event selected. Select an event on the left, or{" "}
        <Link to="new" className="text-blue-500 underline">
          create a new event.
        </Link>
      </p>
    </>
  );
}
