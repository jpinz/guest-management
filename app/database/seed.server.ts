/* eslint-disable no-console */
import { faker } from '@faker-js/faker';
import { PrismaClient, Role } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "../utils/env";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

const email = "hello@supabase.com";

const getUserId = async (): Promise<string> => {
  const userList = await supabaseAdmin.auth.admin.listUsers();

  if (userList.error) {
    throw userList.error;
  }

  const existingUserId = userList.data.users.find(
    (user) => user.email === email
  )?.id;

  if (existingUserId) {
    return existingUserId;
  }

  const newUser = await supabaseAdmin.auth.admin.createUser({
    email,
    password: "supabase",
    email_confirm: true,
  });

  if (newUser.error) {
    throw newUser.error;
  }

  return newUser.data.user.id;
};

async function seed() {
  try {
    const id = await getUserId();

    // cleanup the existing database
    await prisma.user.delete({ where: { email } }).catch(() => {
      // no worries if it doesn't exist yet
    });

    const org = await prisma.organization.create({
      data: {
        id: faker.datatype.uuid(),
        contactEmail: email,
        name: faker.word.noun(),
      },
    });

    const user = await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: faker.name.fullName(),
        gradYear: faker.date.future(4).getFullYear(),
        rushClass: faker.date.recent().getFullYear(),
        role: faker.helpers.arrayElement(Object.values(Role)),
        organizationId: org.id,
      },
    });

    // await prisma.note.create({
    //   data: {
    //     title: "My first note",
    //     body: "Hello, world!",
    //     userId: user.id,
    //   },
    // });

    console.log(`Database has been seeded. 🌱\n`);
    console.log(
      `User added to your database 👇 \n🆔: ${user.id}\n📧: ${user.email}\n🔑: supabase`
    );
  } catch (cause) {
    console.error(cause);
    throw new Error("Seed failed 🥲");
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });