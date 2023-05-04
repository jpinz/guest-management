import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireAuthSession } from "~/modules/auth";

export async function loader({ request }: LoaderArgs) {
  var authSession = await requireAuthSession(request);

  return redirect(`/dashboard/${authSession.organization.id}`)
}