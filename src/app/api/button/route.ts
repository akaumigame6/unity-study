import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest) => {
  try {
    const buttons = await prisma.button.findMany({
      // ◀ 推論を利用して posts の型を決定
      select: {
        id: true,
        push: true,
      },
    });
    return NextResponse.json(buttons);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};
