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
  const test_user = await prisma.user.create({
    data: {
      id: "eb8edc15-074c-47e2-bac3-ec30c0196f5e",
      role: "USER",
      name: "user1",
      buttons: {
        create: [
          { postId: p1.id, completed: false },
          { postId: p2.id, completed: false },
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
