import type { Organization } from "~/database";
import { db } from "~/database";

export async function getOrganization(organizationId: string) {
  return db.organization.findUnique({ where: { id: organizationId }});
}

export async function getOrganizations(organizationId?: string) {
  return db.organization.findMany({
    where: {
      ...(organizationId ? {id: organizationId } : {}),
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
