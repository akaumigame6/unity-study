import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post } from "@prisma/client";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
      // ◀ 推論を利用して posts の型を決定
      select: {
        id: true,
        title: true,
        synopsis: true,
        content: true,
        createdAt: true,
        updateAt: true,
        unlockPostId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};
