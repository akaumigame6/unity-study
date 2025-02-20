import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient(); // PrismaClientのインスタンス生成

const main = async () => {
  // 各テーブルから既存の全レコードを削除;
  await prisma.post?.deleteMany();
  await prisma.user?.deleteMany();
  await prisma.button?.deleteMany();

  // 投稿記事データの作成  (テーブルに対するレコードの挿入)
  const p1 = await prisma.post.create({
    data: {
      title: "投稿1",
      synopsis: "playerを設置してみよう",
      content: "投稿1の本文。<br/>投稿1の本文。投稿1の本文。",
      coverImageURL:
        "https://w1980.blob.core.windows.net/pg3/cover-img-red.jpg",
      unlockPostId: [],
    },
  });

  const p2 = await prisma.post.create({
    data: {
      title: "投稿2",
      synopsis: "playerを矢印キーで動かせるようにしよう",
      content: "投稿2の本文。<br/>投稿2の本文。投稿2の本文。",
      coverImageURL:
        "https://w1980.blob.core.windows.net/pg3/cover-img-green.jpg",
      unlockPostId: [p1.id],
    },
  });

  console.log(JSON.stringify(p1, null, 2));
  console.log(JSON.stringify(p2, null, 2));

  //Userデータの作成
  const u1 = await prisma.user.create({
    data: {
      id: "e10b4313-3d4f-40ac-81b2-03374bfad0e6",
      role: "ADMIN",
      name: "user1",
      password: "user1_p",
      button: {
        create: [
          { postId: p1.id, push: false },
          { postId: p2.id, push: false },
        ],
      },
    },
  });
  const u2 = await prisma.user.create({
    data: {
      id: "c96d0c06-bd86-4b32-94b6-4567f54c0740",
      role: "USER",
      name: "user2",
      password: "user2_p",
      button: {
        create: [
          { postId: p1.id, push: false },
          { postId: p2.id, push: false },
        ],
      },
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
