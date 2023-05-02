import type { EventGuest } from "@prisma/client";

import { EventGuestComponent } from "../guest";

export function GuestListComponent(props: { guests: EventGuest[], frontDoorMode: boolean }) {

  return (
    <div>
        {props.guests.map((guest) => (<EventGuestComponent key={guest.id} guest={guest} frontDoorMode={props.frontDoorMode} />))}
    </div>
  );
}
