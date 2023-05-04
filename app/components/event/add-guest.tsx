import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/20/solid";
import { Gender } from "@prisma/client";
import type { Event } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";

export const NewEventGuestFormSchema = z.object({
  name: z.string().min(2, "require-name"),
  gender: z.nativeEnum(Gender),
});

export function AddGuestComponent(props: { event: Event; gender: string }) {
  const zo = useZorm("NewQuestionWizardScreen", NewEventGuestFormSchema);
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
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name={zo.fields.name()}
              id={`add-${props.gender}`}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="John Smith"
            />
            {zo.errors.name()?.message && (
              <div className="pt-1 text-red-700" id="name-error">
                {zo.errors.name()?.message}
              </div>
            )}
          </div>
          <input
            name={zo.fields.gender()}
            value={props.gender}
            type="text"
            hidden={true}
            readOnly={true}
          />

          <button
            type="submit"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <MagnifyingGlassIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </Form>
  );
}
