import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest) => {
  try {
    const buttons = await prisma.button.findMany({
      select: {
        id: true,
        postId: true,
        userId: true,
        completed: true,
      },
    });
    return NextResponse.json(buttons);
  } catch (error) {
    console.error(error);
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "投稿記事の学習情報の取得に失敗しました" },
      { status: 500 }
    );
  }
};
