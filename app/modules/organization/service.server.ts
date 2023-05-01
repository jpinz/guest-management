import type { Organization } from "~/database";
import { db } from "~/database";

export async function getOrganization({ id }: Pick<Organization, "id">) {
  return db.organization.findFirst({
    select: {
      id: true,
      name: true,
      contactEmail: true,
    },
    where: { id },
  });
}

export async function getOrganizations() {
  return db.organization.findMany({
    select: {
      id: true,
      name: true,
      contactEmail: true,
    },
    orderBy: { name: "desc" },
  });
}

export async function createOrganization(organization: Omit<Organization, "id">) {
  return db.organization.create({
    data: {
      name: organization.name,
      contactEmail: organization.contactEmail,
    },
  });
}

export async function deleteOrganization({ id }: Pick<Organization, "id">) {
  return db.organization.deleteMany({
    where: { id },
  });
}
