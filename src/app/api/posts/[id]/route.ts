import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest, routeParams: RouteParams) => {
  try {
    // パラメータプレースホルダから id を取得
    const id = routeParams.params.id;

    // findUnique は id に一致する「1件」のレコードを取得するメソッド
    // もし条件に一致するレコードが存在しないときは null が戻り値となる
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        synopsis: true,
        content: true,
        coverImageURL: true,
        createdAt: true,
        updateAt: true,
        unlockPostId: true,
      },
    });

    // 投稿記事が存在しないときの ( post が null のときの) 処理
    if (!post) {
      return NextResponse.json(
        { error: `id='${id}'の投稿記事は見つかりませんでした` },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の取得に失敗しました" },
      { status: 500 }
    );
  }
};
