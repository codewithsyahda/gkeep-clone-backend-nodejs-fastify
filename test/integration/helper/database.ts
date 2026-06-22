import jsonDocStrToText from '@/common/helper/jsonDocStrToText.js';
import prismaClient from '@/common/lib/prismaClient.js';

export async function seedTables() {
  await prismaClient.user.createMany({
    data: [
      {
        id: 'id-user-1',
        email: 'foo@email.com',
        name: 'Foo',
      },
      {
        id: 'id-user-2',
        email: 'bar@email.com',
        name: 'Bar',
      },
    ],
  });

  for (const [idxUser, name] of ['Foo', 'Bar'].entries()) {
    for (const [idxData] of new Array(9).entries()) {
      const jsonContent = `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note ${idxData + 1} (${name})"}]}]}`;

      await prismaClient.note.create({
        data: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idxData + 1}`,
          title: `Title Note ${idxData + 1} (${name})`,
          jsonContent,
          textContent: jsonDocStrToText(jsonContent),
          createdAt: new Date(2026, 0, idxData + 1),
          updatedAt: new Date(2026, 0, idxData + 1),
          authorId: `id-user-${idxUser + 1}`,
        },
      });
    }
  }

  for (const [idxUser] of new Array(2).entries()) {
    for (const idNote of [4, 5, 6, 9]) {
      await prismaClient.note.update({
        where: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idNote}`,
        },
        data: {
          archivedAt: new Date(2026, 0, idNote),
        },
      });
    }
  }

  for (const [idxUser] of new Array(2).entries()) {
    for (const idNote of [7, 8, 9]) {
      await prismaClient.note.update({
        where: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idNote}`,
        },
        data: {
          trashedAt: new Date(2026, 0, idNote),
        },
      });
    }
  }
}

export async function seedUsersNotes(
  users: {
    userId: string;
    name: string;
  }[],
) {
  for (const [idxUser, user] of users.entries()) {
    for (const [idxData] of new Array(9).entries()) {
      const jsonContent = `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content note ${idxData + 1} (${user.name})"}]}]}`;

      await prismaClient.note.create({
        data: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idxData + 1}`,
          title: `Title Note ${idxData + 1} (${user.name})`,
          jsonContent,
          textContent: jsonDocStrToText(jsonContent),
          createdAt: new Date(2026, 0, idxData + 1),
          updatedAt: new Date(2026, 0, idxData + 1),
          authorId: user.userId,
        },
      });
    }
  }

  for (const [idxUser] of new Array(users.length).entries()) {
    for (const idNote of [4, 5, 6, 9]) {
      await prismaClient.note.update({
        where: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idNote}`,
        },
        data: {
          archivedAt: new Date(2026, 0, idNote),
        },
      });
    }
  }

  for (const [idxUser] of new Array(users.length).entries()) {
    for (const idNote of [7, 8, 9]) {
      await prismaClient.note.update({
        where: {
          id: `${idxUser + 1}0000000-0000-0000-0000-00000000000${idNote}`,
        },
        data: {
          trashedAt: new Date(2026, 0, idNote),
        },
      });
    }
  }
}

export async function resetTables() {
  await prismaClient.$transaction([
    prismaClient.account.deleteMany(),
    prismaClient.session.deleteMany(),
    prismaClient.note.deleteMany(),
    prismaClient.user.deleteMany(),
  ]);
}
